import { ConnectorStatusBadge } from "@/components/connectors/connector-status-badge";
import type { ConnectorType } from "@/types";

interface PlanStep {
  id: string;
  order: number;
  name: string;
  description: string;
  connectorType: string;
  actionMode: string;
}

export function PlanStepsList({ steps }: { steps: PlanStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step) => (
        <li key={step.id} className="flex items-start gap-4">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground">
            {step.order}
          </span>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <p className="text-sm font-medium">{step.name}</p>
              <ConnectorStatusBadge type={step.connectorType as ConnectorType} />
              <span className="text-xs text-muted-foreground uppercase font-medium">
                {step.actionMode}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
