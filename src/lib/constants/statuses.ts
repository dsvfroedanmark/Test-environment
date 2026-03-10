import type { RequestStatus, PlanApprovalStatus, StepStatus } from "@/types";

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  DRAFT: "Draft",
  PLANNING: "Planning",
  PLAN_READY: "Plan Ready",
  PLAN_APPROVED: "Plan Approved",
  EXECUTING: "Executing",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export const PLAN_STATUS_LABELS: Record<PlanApprovalStatus, string> = {
  PENDING: "Awaiting Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CHANGES_REQUESTED: "Changes Requested",
};

export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  PENDING: "Pending",
  RUNNING: "Running",
  COMPLETED: "Done",
  FAILED: "Failed",
  SKIPPED: "Skipped",
};

export const TERMINAL_REQUEST_STATUSES: RequestStatus[] = ["COMPLETED", "FAILED", "CANCELLED"];
export const ACTIVE_REQUEST_STATUSES: RequestStatus[] = ["EXECUTING", "PLANNING"];
