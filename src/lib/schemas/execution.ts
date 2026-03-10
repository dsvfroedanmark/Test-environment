import { z } from "zod";

export const ExecuteRequestSchema = z.object({
  requestId: z.string().min(1),
});

export type ExecuteRequestInput = z.infer<typeof ExecuteRequestSchema>;
