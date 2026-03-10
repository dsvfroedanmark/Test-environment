import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { ExecutionStatusCard } from "@/components/execution/execution-status-card";
import { ExecutionTimeline } from "@/components/execution/execution-timeline";
import { RequestStatusBadge } from "@/components/requests/request-summary";
import type { RequestStatus, StepStatus } from "@/types";

async function getData(requestId: string) {
  return prisma.request.findUnique({
    where: { id: requestId },
    include: {
      plan: { include: { steps: { orderBy: { order: "asc" } } } },
    },
  });
}

export default async function RunPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const request = await getData(requestId);

  if (!request) notFound();
  if (!request.plan) redirect(`/requests/${requestId}/plan`);
  if (request.status === "COMPLETED" || request.status === "FAILED") {
    redirect(`/requests/${requestId}/results`);
  }

  const steps = request.plan.steps;
  const completed = steps.filter((s) => s.status === "COMPLETED").length;
  const failed = steps.filter((s) => s.status === "FAILED").length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Execution Run"
        description={request.title ?? request.rawInput}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Plan", href: `/requests/${requestId}/plan` },
          { label: "Execution" },
        ]}
        badges={<RequestStatusBadge status={request.status as RequestStatus} />}
      />

      <div className="space-y-4">
        <ExecutionStatusCard
          completed={completed}
          total={steps.length}
          failed={failed}
        />

        <ExecutionTimeline
          steps={steps.map((s) => ({
            id: s.id,
            order: s.order,
            name: s.name,
            description: s.description,
            connectorType: s.connectorType,
            status: s.status as StepStatus,
            actionMode: s.actionMode,
            startedAt: s.startedAt,
            completedAt: s.completedAt,
            errorMessage: s.errorMessage,
          }))}
          requestId={requestId}
          planApproved={request.plan.approvalStatus === "APPROVED"}
          requestStatus={request.status}
        />
      </div>
    </div>
  );
}
