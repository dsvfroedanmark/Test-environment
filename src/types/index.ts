// ─── Enums ────────────────────────────────────────────────────────────────────

export type ConnectorType =
  | "BROWSER"
  | "ANTHROPIC"
  | "GEMINI"
  | "MAILCHIMP"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "LINKEDIN"
  | "OUTLOOK"
  | "CUSTOM";

export type RequestStatus =
  | "DRAFT"
  | "PLANNING"
  | "PLAN_READY"
  | "PLAN_APPROVED"
  | "EXECUTING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type PlanApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

export type StepStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "SKIPPED";

export type ArtifactType =
  | "TEXT"
  | "IMAGE"
  | "DOCUMENT"
  | "DATA"
  | "SOCIAL_POST"
  | "EMAIL"
  | "REPORT";

export type ActionMode = "READ" | "WRITE";

// ─── Plan Types ───────────────────────────────────────────────────────────────

export interface PlanStep {
  order: number;
  name: string;
  description: string;
  connectorType: ConnectorType;
  actionMode: ActionMode;
  expectedOutput: string;
}

export interface ProposedConnector {
  type: ConnectorType;
  name: string;
  reason: string;
  mode: ActionMode;
}

export interface ExecutionPlanData {
  requestType: string;
  interpretedGoal: string;
  deliverables: string[];
  assumptions: string[];
  proposedConnectors: ProposedConnector[];
  steps: PlanStep[];
  expectedOutputs: string[];
  requiresApproval: boolean;
}

// ─── Artifact Types ───────────────────────────────────────────────────────────

export interface DraftPost {
  draftNumber: number;
  adCopy: string;
  graphicDescription: string;
  platform?: string;
}

export interface ArtifactContent {
  text?: string;
  imageUrl?: string;
  platform?: string;
  postDate?: string;
  caption?: string;
  hashtags?: string[];
  drafts?: DraftPost[];
  rows?: Record<string, string>[];
  columns?: string[];
  [key: string]: unknown;
}

// ─── Connector Types ──────────────────────────────────────────────────────────

export interface ConnectorCapability {
  name: string;
  type: ConnectorType;
  description: string;
  supportedActions: string[];
  authRequired: boolean;
  mode: ActionMode | "BOTH";
}

// ─── Request Summary ──────────────────────────────────────────────────────────

export interface RequestSummary {
  id: string;
  title: string | null;
  rawInput: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  plan?: {
    id: string;
    approvalStatus: PlanApprovalStatus;
    interpretedGoal: string;
  } | null;
}
