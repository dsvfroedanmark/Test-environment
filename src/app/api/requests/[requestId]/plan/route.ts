import { NextRequest, NextResponse } from "next/server";
import { getRequestById } from "@/lib/db/queries/requests";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    const request = await getRequestById(requestId);

    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    if (!request.plan) return NextResponse.json({ error: "No plan found" }, { status: 404 });

    return NextResponse.json({ plan: request.plan });
  } catch (_err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
