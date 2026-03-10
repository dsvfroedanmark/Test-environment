import { Badge } from "@/components/ui/badge";
import type { RequestStatus, PlanApprovalStatus, StepStatus } from "@/types";
import {
  REQUEST_STATUS_LABELS,
  PLAN_STATUS_LABELS,
  STEP_STATUS_LABELS,
} from "@/lib/constants/statuses";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const REQUEST_STATUS_VARIANTS: Record<RequestStatus, BadgeVariant> = {
  DRAFT: "outline",
  PLANNING: "secondary",
  PLAN_READY: "secondary",
  PLAN_APPROVED: "default",
  EXECUTING: "default",
  COMPLETED: "default",
  FAILED: "destructive",
  CANCELLED: "outline",
};

const PLAN_STATUS_VARIANTS: Record<PlanApprovalStatus, BadgeVariant> = {
  PENDING: "outline",
  APPROVED: "default",
  REJECTED: "destructive",
  CHANGES_REQUESTED: "secondary",
};

const STEP_STATUS_VARIANTS: Record<StepStatus, BadgeVariant> = {
  PENDING: "outline",
  RUNNING: "secondary",
  COMPLETED: "default",
  FAILED: "destructive",
  SKIPPED: "outline",
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge variant={REQUEST_STATUS_VARIANTS[status]}>
      {REQUEST_STATUS_LABELS[status]}
    </Badge>
  );
}

export function PlanStatusBadge({ status }: { status: PlanApprovalStatus }) {
  return (
    <Badge variant={PLAN_STATUS_VARIANTS[status]}>
      {PLAN_STATUS_LABELS[status]}
    </Badge>
  );
}

export function StepStatusBadge({ status }: { status: StepStatus }) {
  return (
    <Badge variant={STEP_STATUS_VARIANTS[status]}>
      {STEP_STATUS_LABELS[status]}
    </Badge>
  );
}
