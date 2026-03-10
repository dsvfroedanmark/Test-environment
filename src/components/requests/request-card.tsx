import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { RequestStatusBadge } from "./request-summary";
import { formatDate } from "@/lib/utils/dates";
import { ArrowRight } from "lucide-react";
import type { RequestStatus, PlanApprovalStatus } from "@/types";

interface RequestCardProps {
  id: string;
  title: string | null;
  rawInput: string;
  status: RequestStatus;
  createdAt: string | Date;
  plan?: {
    approvalStatus: PlanApprovalStatus;
    interpretedGoal: string;
  } | null;
}

export function RequestCard({ id, title, rawInput, status, createdAt, plan }: RequestCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="py-4 px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <RequestStatusBadge status={status} />
              <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
            </div>
            <p className="font-medium text-sm leading-snug line-clamp-2">
              {title ?? rawInput}
            </p>
            {plan && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {plan.interpretedGoal}
              </p>
            )}
          </div>
          <Link
            href={getRequestLink(id, status)}
            className="shrink-0 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function getRequestLink(id: string, status: RequestStatus): string {
  if (status === "EXECUTING") return `/requests/${id}/run`;
  if (status === "COMPLETED" || status === "FAILED") return `/requests/${id}/results`;
  return `/requests/${id}/plan`;
}
