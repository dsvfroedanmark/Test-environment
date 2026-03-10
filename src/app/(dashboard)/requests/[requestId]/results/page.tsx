import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { ResultsOverview } from "@/components/results/results-overview";
import { ArtifactCard } from "@/components/results/artifact-card";
import { RequestStatusBadge } from "@/components/requests/request-summary";
import { Card, CardContent } from "@/components/ui/card";
import type { RequestStatus, ArtifactType } from "@/types";

async function getData(requestId: string) {
  return prisma.request.findUnique({
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
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const request = await getData(requestId);

  if (!request) notFound();

  const steps = request.plan?.steps ?? [];
  const artifacts = request.plan?.artifacts ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Results"
        description={request.title ?? request.rawInput}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Plan", href: `/requests/${requestId}/plan` },
          { label: "Run", href: `/requests/${requestId}/run` },
          { label: "Results" },
        ]}
        badges={<RequestStatusBadge status={request.status as RequestStatus} />}
      />

      <div className="space-y-6">
        <ResultsOverview
          steps={steps.map((s) => ({
            order: s.order,
            name: s.name,
            status: s.status,
            completedAt: s.completedAt,
          }))}
          artifactCount={artifacts.length}
        />

        {artifacts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No artifacts generated yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Generated Artifacts ({artifacts.length})
            </p>
            {artifacts.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                type={artifact.type as ArtifactType}
                title={artifact.title}
                description={artifact.description}
                contentJson={artifact.contentJson}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
