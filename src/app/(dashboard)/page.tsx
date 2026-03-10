import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { RequestCard } from "@/components/requests/request-card";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Inbox } from "lucide-react";
import type { PlanApprovalStatus, RequestStatus } from "@/types";
import { DEFAULT_WORKSPACE_ID } from "@/lib/auth/auth-placeholder";

async function getRequests() {
  try {
    return await prisma.request.findMany({
      where: { workspaceId: DEFAULT_WORKSPACE_ID },
      include: {
        plan: {
          select: { id: true, approvalStatus: true, interpretedGoal: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const requests = await getRequests();

  const stats = [
    { label: "Total Requests", value: requests.length },
    { label: "Completed", value: requests.filter((r) => r.status === "COMPLETED").length },
    { label: "Awaiting Approval", value: requests.filter((r) => r.status === "PLAN_READY").length },
  ];

  return (
    <div>
      <AppHeader
        title="Dashboard"
        description="Approval-first AI orchestration workspace"
        actions={
          <Button asChild size="sm">
            <Link href="/requests/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        }
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="py-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                <p className="text-3xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Request list */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Recent Requests
          </p>
          {requests.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-medium mb-1">No requests yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit a natural-language request to get started
                </p>
                <Button asChild size="sm">
                  <Link href="/requests/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create First Request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            requests.map((req) => (
              <RequestCard
                key={req.id}
                id={req.id}
                title={req.title}
                rawInput={req.rawInput}
                status={req.status as RequestStatus}
                createdAt={req.createdAt}
                plan={req.plan ? {
                  approvalStatus: req.plan.approvalStatus as PlanApprovalStatus,
                  interpretedGoal: req.plan.interpretedGoal,
                } : null}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
