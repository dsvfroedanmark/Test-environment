import { prisma } from "@/lib/db/prisma";
import { updateStepStatus, createArtifact } from "@/lib/db/queries/runs";
import { executeStep } from "./step-executor";
import { logger } from "@/lib/utils/logger";
import type { ExecutionResult } from "./execution.types";

// ─── Runner ───────────────────────────────────────────────────────────────────
// Iterates over steps for an approved plan, executing each sequentially.
// Designed for future upgrade to async/job-queue execution.

export async function runPlan(planId: string, requestId: string): Promise<ExecutionResult> {
  const steps = await prisma.executionStep.findMany({
    where: { planId },
    orderBy: { order: "asc" },
  });

  let stepsCompleted = 0;
  let stepsFailed = 0;

  for (const step of steps) {
    logger.info("runner", `Starting step ${step.order}: ${step.name}`);

    await updateStepStatus(step.id, "RUNNING", { startedAt: new Date() });

    try {
      const result = await executeStep(step);

      if (!result.success) {
        throw new Error(result.error ?? "Connector returned failure");
      }

      await updateStepStatus(step.id, "COMPLETED", {
        outputJson: result.data as object ?? {},
        completedAt: new Date(),
      });

      if (result.artifacts) {
        for (const artifact of result.artifacts) {
          await createArtifact({
            planId,
            stepId: step.id,
            type: artifact.type,
            title: artifact.title,
            description: artifact.description,
            contentJson: artifact.content as object,
          });
        }
      }

      stepsCompleted++;
      logger.info("runner", `Completed step ${step.order}: ${step.name}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      logger.error("runner", `Failed step ${step.order}: ${step.name}`, errorMessage);

      await updateStepStatus(step.id, "FAILED", {
        errorMessage,
        completedAt: new Date(),
      });

      stepsFailed++;
      // Non-fatal — continue to next step
    }
  }

  return {
    success: stepsFailed === 0,
    stepsCompleted,
    stepsFailed,
    planId,
    requestId,
  };
}
