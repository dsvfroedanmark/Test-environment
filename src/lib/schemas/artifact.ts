import { z } from "zod";

export const DraftPostSchema = z.object({
  draftNumber: z.number(),
  adCopy: z.string(),
  graphicDescription: z.string(),
  platform: z.string().optional(),
});

export const ArtifactContentSchema = z.object({
  text: z.string().optional(),
  imageUrl: z.string().optional(),
  platform: z.string().optional(),
  drafts: z.array(DraftPostSchema).optional(),
  schedule: z.array(z.record(z.string(), z.unknown())).optional(),
}).passthrough();

export type DraftPostInput = z.infer<typeof DraftPostSchema>;
