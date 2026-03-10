import { prisma } from "@/lib/db/prisma";

export async function getStepsForPlan(planId: string) {
  return prisma.executionStep.findMany({
    where: { planId },
    orderBy: { order: "asc" },
  });
}

export async function updateStepStatus(
  stepId: string,
  status: string,
  data?: {
    outputJson?: object;
    errorMessage?: string;
    startedAt?: Date;
    completedAt?: Date;
  }
) {
  return prisma.executionStep.update({
    where: { id: stepId },
    data: {
      status: status as never,
      ...data,
    },
  });
}

export async function createArtifact(data: {
  planId: string;
  stepId?: string;
  type: string;
  title: string;
  description?: string;
  contentJson: object;
}) {
  return prisma.outputArtifact.create({
    data: {
      planId: data.planId,
      stepId: data.stepId,
      type: data.type as never,
      title: data.title,
      description: data.description,
      contentJson: data.contentJson,
    },
  });
}
