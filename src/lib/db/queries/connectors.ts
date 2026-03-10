import { prisma } from "@/lib/db/prisma";

export async function getConnectorsForWorkspace(workspaceId: string) {
  return prisma.connector.findMany({
    where: { workspaceId },
  });
}

export async function upsertConnector(data: {
  workspaceId: string;
  type: string;
  enabled: boolean;
}) {
  return prisma.connector.upsert({
    where: {
      workspaceId_type: {
        workspaceId: data.workspaceId,
        type: data.type as never,
      },
    },
    update: { enabled: data.enabled },
    create: {
      workspaceId: data.workspaceId,
      type: data.type as never,
      name: data.type,
      enabled: data.enabled,
    },
  });
}
