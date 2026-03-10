import type { ConnectorType, ExecutionPlanData } from "@/types";

export interface PlannerInput {
  rawInput: string;
  workspaceId: string;
  enabledConnectors?: ConnectorType[];
}

export interface PlannerResult {
  plan: ExecutionPlanData;
  usedMock: boolean;
}
