import { Card, CardContent } from "@/components/ui/card";

interface ExecutionStatusCardProps {
  completed: number;
  total: number;
  failed: number;
}

export function ExecutionStatusCard({ completed, total, failed }: ExecutionStatusCardProps) {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {completed} of {total} steps
            {failed > 0 && ` (${failed} failed)`}
          </span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
      </CardContent>
    </Card>
  );
}
