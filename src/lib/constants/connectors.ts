import type { ConnectorType } from "@/types";

export const CONNECTOR_LABELS: Record<ConnectorType, string> = {
  BROWSER: "Browser",
  ANTHROPIC: "Claude AI",
  GEMINI: "Gemini AI",
  MAILCHIMP: "Mailchimp",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  LINKEDIN: "LinkedIn",
  OUTLOOK: "Outlook",
  CUSTOM: "Custom",
};

export const CONNECTOR_COLORS: Record<ConnectorType, string> = {
  BROWSER: "bg-blue-100 text-blue-800 border-blue-200",
  ANTHROPIC: "bg-orange-100 text-orange-800 border-orange-200",
  GEMINI: "bg-purple-100 text-purple-800 border-purple-200",
  MAILCHIMP: "bg-yellow-100 text-yellow-800 border-yellow-200",
  INSTAGRAM: "bg-pink-100 text-pink-800 border-pink-200",
  FACEBOOK: "bg-indigo-100 text-indigo-800 border-indigo-200",
  LINKEDIN: "bg-sky-100 text-sky-800 border-sky-200",
  OUTLOOK: "bg-teal-100 text-teal-800 border-teal-200",
  CUSTOM: "bg-gray-100 text-gray-800 border-gray-200",
};

export const MOCK_CONNECTOR_TYPES: ConnectorType[] = [
  "BROWSER",
  "ANTHROPIC",
  "INSTAGRAM",
  "FACEBOOK",
];
