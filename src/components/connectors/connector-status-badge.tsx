import { CONNECTOR_LABELS, CONNECTOR_COLORS } from "@/lib/constants/connectors";
import type { ConnectorType } from "@/types";

export function ConnectorStatusBadge({ type }: { type: ConnectorType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${CONNECTOR_COLORS[type]}`}
    >
      {CONNECTOR_LABELS[type]}
    </span>
  );
}
