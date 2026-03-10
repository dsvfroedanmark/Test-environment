import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectorStatusBadge } from "./connector-status-badge";
import { Switch } from "@/components/ui/switch";
import { Lock, Zap } from "lucide-react";
import type { ConnectorType } from "@/types";

export interface ConnectorCardProps {
  name: string;
  type: ConnectorType;
  description: string;
  isMock: boolean;
  authRequired: boolean;
  enabled: boolean;
  supportedActions: Array<{ name: string; description: string; mode: string }>;
  saving?: boolean;
  onToggle: (enabled: boolean) => void;
}

export function ConnectorCard({
  name,
  type,
  description,
  isMock,
  authRequired,
  enabled,
  supportedActions,
  saving,
  onToggle,
}: ConnectorCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <ConnectorStatusBadge type={type} />
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {name}
                {isMock && <Badge variant="outline" className="text-xs">Mock</Badge>}
                {authRequired && <Lock className="h-3 w-3 text-muted-foreground" />}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {saving && <span className="text-xs text-muted-foreground">Saving…</span>}
            <Switch checked={enabled} onCheckedChange={onToggle} disabled={saving} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {supportedActions.map((action) => (
            <span
              key={action.name}
              className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5"
            >
              <Zap className="h-2.5 w-2.5" />
              {action.name}
              <span className="text-muted-foreground">({action.mode})</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
