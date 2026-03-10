import { z } from "zod";

export const CreateRequestSchema = z.object({
  rawInput: z.string().min(10, "Request must be at least 10 characters"),
  workspaceId: z.string().min(1),
});

export const ApproveRequestSchema = z.object({
  requestId: z.string().min(1),
  notes: z.string().optional(),
});

export const RequestChangesSchema = z.object({
  requestId: z.string().min(1),
  feedback: z.string().min(1, "Please describe the changes needed"),
});

export type CreateRequestInput = z.infer<typeof CreateRequestSchema>;
export type ApproveRequestInput = z.infer<typeof ApproveRequestSchema>;
export type RequestChangesInput = z.infer<typeof RequestChangesSchema>;
