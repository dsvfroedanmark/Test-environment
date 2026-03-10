import { getConnector } from "@/lib/connectors";
import type { ConnectorType } from "@/types";
import type { ConnectorExecuteInput } from "@/lib/connectors";
import type { StepExecutionResult } from "./execution.types";

// Maps step names to connector action names
const ACTION_MAP: Record<string, string> = {
  "Research brand & trends": "research",
  "Fetch Instagram profile": "get_profile",
  "Fetch Facebook page": "get_page",
  "Generate content calendar": "generate_plan",
  "Generate posting schedule": "generate_schedule",
};

export async function executeStep(step: {
  id: string;
  name: string;
  connectorType: string;
  inputJson: unknown;
}): Promise<StepExecutionResult> {
  const connector = getConnector(step.connectorType as ConnectorType);

  if (!connector) {
    return { success: false, error: `No connector registered for type: ${step.connectorType}` };
  }

  const action = resolveAction(step.name);
  const params = buildParams(step.inputJson, step.name);
  const execInput: ConnectorExecuteInput = { action, params, stepId: step.id };

  const result = await connector.execute(execInput);

  return {
    success: result.success,
    data: result.data,
    artifacts: result.artifacts,
    error: result.error,
  };
}

function resolveAction(stepName: string): string {
  if (/^Generate ad copy/i.test(stepName)) return "generate_copy";
  return ACTION_MAP[stepName] ?? "execute";
}

function buildParams(inputJson: unknown, stepName: string): Record<string, unknown> {
  const base = (inputJson as Record<string, unknown>) ?? {};
  return {
    brand: base.brand ?? "Naturegrass",
    postCount: base.postCount ?? 12,
    days: base.days ?? 90,
    draftCount: base.draftCount ?? 3,
    topic: base.topic ?? stepName,
    platform: base.platform ?? "Instagram",
    profileName: base.profileName ?? (base.brand ?? "Naturegrass"),
    pageName: base.pageName ?? (base.brand ?? "Naturegrass"),
    ...base,
  };
}
