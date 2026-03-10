import { ExecutionPlanSchema } from "@/lib/schemas/planner";
import { detectRequestType } from "./planner.rules";
import { buildSocialMediaPlan, buildGenericPlan } from "./mock-planner";
import type { PlannerInput, PlannerResult } from "./planner.types";

// ─── Planner Service ──────────────────────────────────────────────────────────
// Route requests to the appropriate plan builder.
// Replace the internals here to plug in a real AI model — the interface stays the same.

export async function generatePlan(input: PlannerInput): Promise<PlannerResult> {
  const requestType = detectRequestType(input.rawInput);

  const plan =
    requestType === "SOCIAL_MEDIA"
      ? buildSocialMediaPlan(input.rawInput, input.enabledConnectors)
      : buildGenericPlan(input.rawInput);

  // Validate with Zod before returning
  ExecutionPlanSchema.parse(plan);

  return { plan, usedMock: true };
}
