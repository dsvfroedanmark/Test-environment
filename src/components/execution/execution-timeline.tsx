"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectorStatusBadge } from "@/components/connectors/connector-status-badge";
import { StepStatusBadge } from "@/components/requests/request-summary";
import { formatDate } from "@/lib/utils/dates";
import { Clock, Play, Loader2, ShieldAlert } from "lucide-react";
import type { ConnectorType, StepStatus } from "@/types";

interface Step {
  id: string;
  order: number;
  name: string;
  description: string;
  connectorType: string;
  status: StepStatus;
  actionMode: string;
  startedAt?: Date | string | null;
  completedAt?: Date | string | null;
  errorMessage?: string | null;
}

interface ExecutionTimelineProps {
  steps: Step[];
  requestId: string;
  planApproved: boolean;
  requestStatus: string;
}

export function ExecutionTimeline({
  steps,
  requestId,
  planApproved,
  requestStatus,
}: ExecutionTimelineProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExecute() {
    if (!confirm("Start execution? This will run all planned steps.")) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/requests/${requestId}/run`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Execution failed");
      router.push(`/requests/${requestId}/results`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Execute CTA */}
      {planApproved && requestStatus !== "EXECUTING" && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Plan approved — ready to execute</p>
                <p className="text-sm text-muted-foreground">
                  All steps are read-only in this demo. No content is published without
                  an additional confirmation.
                </p>
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </p>
            )}
            <Button onClick={handleExecute} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {loading ? "Executing…" : "Start Execution"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Execution Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {steps.map((step, idx) => (
              <li key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium
                      ${step.status === "COMPLETED" ? "border-primary bg-primary text-primary-foreground" :
                        step.status === "RUNNING" ? "border-primary bg-primary/10 text-primary animate-pulse" :
                        step.status === "FAILED" ? "border-destructive bg-destructive/10 text-destructive" :
                        "border-border text-muted-foreground"}`}
                  >
                    {step.status === "COMPLETED" ? "✓" : step.order}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-medium">{step.name}</p>
                    <ConnectorStatusBadge type={step.connectorType as ConnectorType} />
                    <StepStatusBadge status={step.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{step.description}</p>
                  {step.startedAt && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Started {formatDate(step.startedAt)}
                      {step.completedAt && ` · Completed ${formatDate(step.completedAt)}`}
                    </p>
                  )}
                  {step.errorMessage && (
                    <p className="text-xs text-destructive mt-1 bg-destructive/10 px-2 py-1 rounded">
                      {step.errorMessage}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
