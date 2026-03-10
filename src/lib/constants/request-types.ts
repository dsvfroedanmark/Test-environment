export const REQUEST_TYPES = {
  SOCIAL_MEDIA: "Social Media Content Plan",
  EMAIL_CAMPAIGN: "Email Campaign",
  CONTENT_RESEARCH: "Content Research",
  GENERAL: "General Task",
} as const;

export type RequestType = (typeof REQUEST_TYPES)[keyof typeof REQUEST_TYPES];

export const SOCIAL_MEDIA_KEYWORDS = [
  "social media",
  "instagram",
  "facebook",
  "linkedin",
  "some",
  "søme",
  "post",
  "content plan",
  "advertising",
  "ad copy",
];
