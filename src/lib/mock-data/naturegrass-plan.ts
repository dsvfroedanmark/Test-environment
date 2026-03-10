import type { ExecutionPlanData } from "@/types";
import { buildSocialMediaPlan } from "@/lib/planner/mock-planner";
import { NATUREGRASS_RAW_INPUT } from "./naturegrass-request";

// Lazily generated — ensures plan always matches latest planner logic
export function getNaturegrassPlan(): ExecutionPlanData {
  return buildSocialMediaPlan(NATUREGRASS_RAW_INPUT);
}
