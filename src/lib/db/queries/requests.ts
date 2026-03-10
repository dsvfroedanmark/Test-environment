import { prisma } from "@/lib/db/prisma";

export async function getRequestById(id: string) {
  return prisma.request.findUnique({
    where: { id },
    include: {
      plan: {
        include: {
          steps: { orderBy: { order: "asc" } },
          artifacts: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  });
}

export async function getRequestsForWorkspace(workspaceId: string, limit = 20) {
  return prisma.request.findMany({
    where: { workspaceId },
    include: {
      plan: {
        select: {
          id: true,
          approvalStatus: true,
          interpretedGoal: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function createRequest(data: {
  rawInput: string;
  title: string;
  workspaceId: string;
  userId?: string;
}) {
  return prisma.request.create({
    data: {
      ...data,
      status: "PLANNING",
    },
  });
}

export async function updateRequestStatus(
  id: string,
  status: string
) {
  return prisma.request.update({
    where: { id },
    data: { status: status as never },
  });
}
