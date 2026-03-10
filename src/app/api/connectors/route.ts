import { NextRequest, NextResponse } from "next/server";
import { getAllConnectorMetas } from "@/lib/connectors";
import { getConnectorsForWorkspace, upsertConnector } from "@/lib/db/queries/connectors";
import { ConnectorToggleSchema } from "@/lib/schemas/connector";
import { logger } from "@/lib/utils/logger";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
    }

    const [metas, dbConnectors] = await Promise.all([
      Promise.resolve(getAllConnectorMetas()),
      getConnectorsForWorkspace(workspaceId),
    ]);

    const connectors = metas.map((meta) => {
      const db = dbConnectors.find((c) => c.type === meta.type);
      return {
        name: meta.name,
        type: meta.type,
        description: meta.description,
        isMock: meta.isMock,
        authRequired: meta.authRequired,
        enabled: db?.enabled ?? false,
        supportedActions: meta.supportedActions,
      };
    });

    return NextResponse.json({ connectors });
  } catch (err) {
    logger.error("api/connectors GET", "Failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const input = ConnectorToggleSchema.parse(body);

    const connector = await upsertConnector(input);
    return NextResponse.json({ connector });
  } catch (err) {
    logger.error("api/connectors PATCH", "Failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
