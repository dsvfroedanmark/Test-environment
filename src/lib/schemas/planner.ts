import { z } from "zod";

export const ConnectorTypeSchema = z.enum([
  "BROWSER",
  "ANTHROPIC",
  "GEMINI",
  "MAILCHIMP",
  "INSTAGRAM",
  "FACEBOOK",
  "LINKEDIN",
  "OUTLOOK",
  "CUSTOM",
]);

export const ActionModeSchema = z.enum(["READ", "WRITE"]);

export const PlanStepSchema = z.object({
  order: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().min(1),
  connectorType: ConnectorTypeSchema,
  actionMode: ActionModeSchema,
  expectedOutput: z.string(),
});

export const ProposedConnectorSchema = z.object({
  type: ConnectorTypeSchema,
  name: z.string(),
  reason: z.string(),
  mode: ActionModeSchema,
});

export const ExecutionPlanSchema = z.object({
  requestType: z.string(),
  interpretedGoal: z.string().min(1),
  deliverables: z.array(z.string()),
  assumptions: z.array(z.string()),
  proposedConnectors: z.array(ProposedConnectorSchema),
  steps: z.array(PlanStepSchema),
  expectedOutputs: z.array(z.string()),
  requiresApproval: z.boolean(),
});

export type ExecutionPlanSchema = z.infer<typeof ExecutionPlanSchema>;
