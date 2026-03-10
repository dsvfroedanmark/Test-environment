import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { executeApprovedPlan } from "@/lib/execution/engine";
import { logger } from "@/lib/utils/logger";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { plan: true },
    });

    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    if (!request.plan) return NextResponse.json({ error: "No plan found" }, { status: 400 });

    if (request.plan.approvalStatus !== "APPROVED") {
      return NextResponse.json({ error: "Plan must be approved before execution" }, { status: 400 });
    }

    if (request.status === "EXECUTING") {
      return NextResponse.json({ error: "Execution already in progress" }, { status: 400 });
    }

    logger.info("api/run", `Starting execution for request ${requestId}`);
    const result = await executeApprovedPlan(request.plan.id, requestId);

    return NextResponse.json({ result });
  } catch (err) {
    logger.error("api/run", "Execution failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET — return current run status
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        plan: { include: { steps: { orderBy: { order: "asc" } } } },
      },
    });

    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    return NextResponse.json({
      status: request.status,
      steps: request.plan?.steps ?? [],
    });
  } catch (_err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
