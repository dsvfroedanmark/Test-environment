"use client";

import { useState } from "react";
import { ConnectorCard } from "./connector-card";
import type { ConnectorType } from "@/types";

interface ConnectorInfo {
  name: string;
  type: ConnectorType;
  description: string;
  isMock: boolean;
  authRequired: boolean;
  enabled: boolean;
  supportedActions: Array<{ name: string; description: string; mode: string }>;
}

interface ConnectorSettingsListProps {
  connectors: ConnectorInfo[];
  workspaceId: string;
}

export function ConnectorSettingsList({ connectors, workspaceId }: ConnectorSettingsListProps) {
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(connectors.map((c) => [c.type, c.enabled]))
  );
  const [saving, setSaving] = useState<string | null>(null);

  async function toggle(type: string, value: boolean) {
    setSaving(type);
    setStates((prev) => ({ ...prev, [type]: value }));

    try {
      await fetch("/api/connectors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, type, enabled: value }),
      });
    } catch {
      setStates((prev) => ({ ...prev, [type]: !value }));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-4">
      {connectors.map((connector) => (
        <ConnectorCard
          key={connector.type}
          {...connector}
          enabled={states[connector.type] ?? false}
          saving={saving === connector.type}
          onToggle={(v) => toggle(connector.type, v)}
        />
      ))}
    </div>
  );
}
