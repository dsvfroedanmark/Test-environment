import { NextRequest, NextResponse } from "next/server";
import { generatePlan } from "@/lib/planner";
import { createPlan } from "@/lib/db/queries/plans";
import { createRequest, updateRequestStatus, getRequestsForWorkspace } from "@/lib/db/queries/requests";
import { CreateRequestSchema } from "@/lib/schemas/request";
import { truncate } from "@/lib/utils/format";
import { logger } from "@/lib/utils/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = CreateRequestSchema.parse(body);

    const request = await createRequest({
      rawInput: input.rawInput,
      title: truncate(input.rawInput),
      workspaceId: input.workspaceId,
    });

    const { plan } = await generatePlan({
      rawInput: input.rawInput,
      workspaceId: input.workspaceId,
    });

    await createPlan(request.id, plan);
    await updateRequestStatus(request.id, "PLAN_READY");

    logger.info("api/requests", `Created request ${request.id}`);
    return NextResponse.json({ requestId: request.id }, { status: 201 });
  } catch (err) {
    logger.error("api/requests POST", "Failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
    }

    const requests = await getRequestsForWorkspace(workspaceId);
    return NextResponse.json({ requests });
  } catch (err) {
    logger.error("api/requests GET", "Failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
