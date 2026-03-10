import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { ExecutionPlanCard } from "@/components/planning/execution-plan-card";
import { ApprovalActions } from "@/components/planning/approval-actions";
import { RequestStatusBadge, PlanStatusBadge } from "@/components/requests/request-summary";
import { Card, CardContent } from "@/components/ui/card";
import type { ExecutionPlanData, RequestStatus, PlanApprovalStatus } from "@/types";

async function getData(requestId: string) {
  return prisma.request.findUnique({
    where: { id: requestId },
    include: {
      plan: { include: { steps: { orderBy: { order: "asc" } } } },
    },
  });
}

export default async function PlanPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const request = await getData(requestId);

  if (!request) notFound();
  if (!request.plan) redirect("/");
  if (request.status === "EXECUTING") redirect(`/requests/${requestId}/run`);
  if (request.status === "COMPLETED" || request.status === "FAILED") {
    redirect(`/requests/${requestId}/results`);
  }

  const plan = request.plan.planJson as unknown as ExecutionPlanData;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Execution Plan"
        description={request.rawInput}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Plan Review" },
        ]}
        badges={
          <>
            <RequestStatusBadge status={request.status as RequestStatus} />
            <PlanStatusBadge status={request.plan.approvalStatus as PlanApprovalStatus} />
          </>
        }
      />

      <ExecutionPlanCard plan={plan} steps={request.plan.steps} />

      {request.plan.approvalStatus === "PENDING" ||
      request.plan.approvalStatus === "CHANGES_REQUESTED" ? (
        <ApprovalActions requestId={requestId} />
      ) : request.plan.approvalStatus === "APPROVED" ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-4 text-sm text-green-800">
            Plan approved. Execution can begin.{" "}
            <Link href={`/requests/${requestId}/run`} className="font-medium underline">
              Go to execution view →
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
