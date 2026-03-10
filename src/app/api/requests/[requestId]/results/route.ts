import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        plan: {
          include: {
            steps: { orderBy: { order: "asc" } },
            artifacts: { orderBy: { createdAt: "asc" } },
          },
        },
      },
    });

    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    return NextResponse.json({
      status: request.status,
      steps: request.plan?.steps ?? [],
      artifacts: request.plan?.artifacts ?? [],
    });
  } catch (_err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
