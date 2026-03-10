import { z } from "zod";

export const ConnectorToggleSchema = z.object({
  workspaceId: z.string().min(1),
  type: z.string().min(1),
  enabled: z.boolean(),
});

export type ConnectorToggleInput = z.infer<typeof ConnectorToggleSchema>;
