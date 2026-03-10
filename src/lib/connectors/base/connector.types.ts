import type { ConnectorType, ActionMode } from "@/types";

export interface ConnectorAction {
  name: string;
  description: string;
  mode: ActionMode;
}

export interface ConnectorExecuteInput {
  action: string;
  params: Record<string, unknown>;
  stepId?: string;
}

export interface ConnectorArtifact {
  type: string;
  title: string;
  description?: string;
  content: unknown;
}

export interface ConnectorExecuteOutput {
  success: boolean;
  data?: unknown;
  error?: string;
  artifacts?: ConnectorArtifact[];
}

export interface ConnectorMeta {
  name: string;
  type: ConnectorType;
  description: string;
  supportedActions: ConnectorAction[];
  authRequired: boolean;
  isMock: boolean;
}
