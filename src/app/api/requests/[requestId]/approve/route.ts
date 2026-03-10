import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { approvePlan } from "@/lib/db/queries/plans";
import { updateRequestStatus } from "@/lib/db/queries/requests";
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
    if (request.plan.approvalStatus === "APPROVED") {
      return NextResponse.json({ error: "Plan already approved" }, { status: 400 });
    }

    await approvePlan(request.plan.id);
    await updateRequestStatus(requestId, "PLAN_APPROVED");

    logger.info("api/approve", `Plan approved for request ${requestId}`);
    return NextResponse.json({ success: true, planId: request.plan.id });
  } catch (err) {
    logger.error("api/approve", "Failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
