import { prisma } from "@/lib/db/prisma";
import { getAllConnectorMetas } from "@/lib/connectors";
import { ConnectorSettingsList } from "@/components/connectors/connector-settings-list";
import { AppHeader } from "@/components/layout/app-header";
import { DEFAULT_WORKSPACE_ID } from "@/lib/auth/auth-placeholder";
import type { ConnectorType } from "@/types";

async function getConnectorData() {
  const metas = getAllConnectorMetas();

  let dbConnectors: Array<{ type: string; enabled: boolean }> = [];
  try {
    dbConnectors = await prisma.connector.findMany({
      where: { workspaceId: DEFAULT_WORKSPACE_ID },
      select: { type: true, enabled: true },
    });
  } catch {
    // DB unavailable — use defaults
  }

  return metas.map((meta) => {
    const db = dbConnectors.find((c) => c.type === meta.type);
    return {
      name: meta.name,
      type: meta.type as ConnectorType,
      description: meta.description,
      isMock: meta.isMock,
      authRequired: meta.authRequired,
      enabled: db?.enabled ?? false,
      supportedActions: meta.supportedActions,
    };
  });
}

export default async function ConnectorsPage() {
  const connectors = await getConnectorData();

  return (
    <div>
      <AppHeader
        title="Connectors"
        description="Enable or disable connectors used during plan execution. All connectors are mocked in the MVP."
      />
      <div className="p-6 max-w-4xl mx-auto">
        <ConnectorSettingsList connectors={connectors} workspaceId={DEFAULT_WORKSPACE_ID} />
      </div>
    </div>
  );
}
