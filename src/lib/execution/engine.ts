import { prisma } from "@/lib/db/prisma";
import { updateRequestStatus } from "@/lib/db/queries/requests";
import { runPlan } from "./runner";
import { logger } from "@/lib/utils/logger";
import type { ExecutionResult } from "./execution.types";

// ─── Execution Engine ─────────────────────────────────────────────────────────
// Orchestrates the full execution lifecycle for an approved plan.

export async function executeApprovedPlan(
  planId: string,
  requestId: string
): Promise<ExecutionResult> {
  await updateRequestStatus(requestId, "EXECUTING");

  const plan = await prisma.executionPlan.findUnique({ where: { id: planId } });

  if (!plan) {
    throw new Error(`Plan ${planId} not found`);
  }

  if (plan.approvalStatus !== "APPROVED") {
    throw new Error("Plan must be approved before execution");
  }

  logger.info("engine", `Executing plan ${planId} for request ${requestId}`);

  const result = await runPlan(planId, requestId);

  const finalStatus =
    result.stepsFailed > 0 && result.stepsCompleted === 0 ? "FAILED" : "COMPLETED";

  await updateRequestStatus(requestId, finalStatus);

  logger.info("engine", `Execution complete. Status: ${finalStatus}`, {
    stepsCompleted: result.stepsCompleted,
    stepsFailed: result.stepsFailed,
  });

  return result;
}
