import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/dates";

interface Step {
  order: number;
  name: string;
  status: string;
  completedAt?: Date | string | null;
}

interface ResultsOverviewProps {
  steps: Step[];
  artifactCount: number;
}

export function ResultsOverview({ steps, artifactCount }: ResultsOverviewProps) {
  const completed = steps.filter((s) => s.status === "COMPLETED").length;
  const failed = steps.filter((s) => s.status === "FAILED").length;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Steps Completed", value: completed },
          { label: "Steps Failed", value: failed },
          { label: "Artifacts Generated", value: artifactCount },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {label}
              </p>
              <p className="text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Step summary */}
      <Card>
        <CardContent className="py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Step Summary
          </p>
          <div className="space-y-2">
            {steps.map((step) => (
              <div key={step.order} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium
                    ${step.status === "COMPLETED" ? "bg-primary text-primary-foreground" :
                      step.status === "FAILED" ? "bg-destructive text-destructive-foreground" :
                      "bg-secondary text-secondary-foreground"}`}
                >
                  {step.status === "COMPLETED" ? "✓" : step.status === "FAILED" ? "✗" : step.order}
                </span>
                <span className={step.status === "FAILED" ? "text-destructive" : ""}>
                  {step.name}
                </span>
                {step.completedAt && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {formatDate(step.completedAt)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
