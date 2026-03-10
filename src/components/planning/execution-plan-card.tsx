import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectorBadgeList } from "./connector-badge-list";
import { PlanStepsList } from "./plan-steps-list";
import { AssumptionsPanel } from "./assumptions-panel";
import { Target, ListChecks, Lightbulb, Plug, ClipboardList } from "lucide-react";
import type { ExecutionPlanData } from "@/types";

interface ExecutionPlanCardProps {
  plan: ExecutionPlanData;
  steps: Array<{
    id: string;
    order: number;
    name: string;
    description: string;
    connectorType: string;
    actionMode: string;
  }>;
}

export function ExecutionPlanCard({ plan, steps }: ExecutionPlanCardProps) {
  return (
    <div className="space-y-5">
      <Section icon={Target} title="Interpreted Goal">
        <p className="text-sm">{plan.interpretedGoal}</p>
      </Section>

      <Section icon={ListChecks} title="Deliverables">
        <ul className="space-y-1">
          {plan.deliverables.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
              {d}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Plug} title="Proposed Connectors">
        <ConnectorBadgeList connectors={plan.proposedConnectors} />
      </Section>

      <Section icon={ClipboardList} title={`Execution Steps (${steps.length})`}>
        <PlanStepsList steps={steps} />
      </Section>

      <Section icon={Lightbulb} title="Assumptions">
        <AssumptionsPanel assumptions={plan.assumptions} />
      </Section>

      <Section icon={ListChecks} title="Expected Outputs">
        <ul className="space-y-1">
          {plan.expectedOutputs.map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5 shrink-0">•</span>
              {o}
            </li>
          ))}
        </ul>
      </Section>

      <Separator />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
