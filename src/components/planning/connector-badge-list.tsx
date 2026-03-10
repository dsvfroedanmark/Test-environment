import { ConnectorStatusBadge } from "@/components/connectors/connector-status-badge";
import type { ConnectorType, ProposedConnector } from "@/types";

export function ConnectorBadgeList({ connectors }: { connectors: ProposedConnector[] }) {
  return (
    <div className="space-y-3">
      {connectors.map((c, i) => (
        <div key={i} className="flex items-start gap-3">
          <ConnectorStatusBadge type={c.type as ConnectorType} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">{c.reason}</p>
            <span className="text-xs font-medium uppercase text-muted-foreground/70">
              {c.mode}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
