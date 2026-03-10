import { prisma } from "@/lib/db/prisma";
import type { ExecutionPlanData } from "@/types";

export async function getPlanByRequestId(requestId: string) {
  return prisma.executionPlan.findUnique({
    where: { requestId },
    include: {
      steps: { orderBy: { order: "asc" } },
    },
  });
}

export async function createPlan(requestId: string, plan: ExecutionPlanData) {
  // Remove existing plan if present
  const existing = await prisma.executionPlan.findUnique({ where: { requestId } });
  if (existing) {
    await prisma.executionStep.deleteMany({ where: { planId: existing.id } });
    await prisma.executionPlan.delete({ where: { id: existing.id } });
  }

  return prisma.executionPlan.create({
    data: {
      requestId,
      interpretedGoal: plan.interpretedGoal,
      deliverables: plan.deliverables,
      assumptions: plan.assumptions,
      expectedOutputs: plan.expectedOutputs,
      planJson: plan as unknown as object,
      steps: {
        create: plan.steps.map((step) => ({
          order: step.order,
          name: step.name,
          description: step.description,
          connectorType: step.connectorType,
          actionMode: step.actionMode,
          inputJson: buildStepInput(plan),
        })),
      },
    },
  });
}

export async function approvePlan(planId: string) {
  return prisma.executionPlan.update({
    where: { id: planId },
    data: { approvalStatus: "APPROVED", approvedAt: new Date() },
  });
}

function buildStepInput(plan: ExecutionPlanData): object {
  const brandMatch = plan.interpretedGoal.match(/for\s+([A-Z][a-zA-Z]+)/);
  return {
    brand: brandMatch?.[1] ?? "Brand",
    postCount: 12,
    days: 90,
    draftCount: 3,
  };
}
