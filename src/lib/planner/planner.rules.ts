import { SOCIAL_MEDIA_KEYWORDS } from "@/lib/constants/request-types";
import type { ConnectorType } from "@/types";

export function detectRequestType(rawInput: string): "SOCIAL_MEDIA" | "GENERAL" {
  const lower = rawInput.toLowerCase();
  if (SOCIAL_MEDIA_KEYWORDS.some((kw) => lower.includes(kw))) return "SOCIAL_MEDIA";
  return "GENERAL";
}

export function detectPlatforms(rawInput: string): ConnectorType[] {
  const lower = rawInput.toLowerCase();
  const platforms: ConnectorType[] = [];
  if (lower.includes("instagram")) platforms.push("INSTAGRAM");
  if (lower.includes("facebook")) platforms.push("FACEBOOK");
  if (lower.includes("linkedin")) platforms.push("LINKEDIN");
  return platforms.length > 0 ? platforms : ["INSTAGRAM", "FACEBOOK"];
}

export function extractBrand(rawInput: string): string {
  // Look for quoted brand name first
  const quoted = rawInput.match(/['"]([^'"]+)['"]/);
  if (quoted) return quoted[1];

  // Look for capitalised word that might be a brand
  const words = rawInput.split(/\s+/);
  const capitalised = words.find(
    (w) => w.length > 3 && /^[A-Z]/.test(w) && !/^(The|For|And|With|From|That|This|Generate|Create|Build|Each|Must|Post|Plan|Over|Days|Draft|Copy|Their|Graphic|Include|Minimum|Promoting|Webshop|Products)$/.test(w)
  );
  return capitalised ?? "Brand";
}

export function extractPostCount(rawInput: string): number {
  const match = rawInput.match(/(\d+)\s+posts?/i);
  return match ? parseInt(match[1]) : 12;
}

export function extractDays(rawInput: string): number {
  const match = rawInput.match(/(\d+)[- ]day/i);
  return match ? parseInt(match[1]) : 90;
}

export function extractDraftsPerPost(rawInput: string): number {
  const match = rawInput.match(/(\d+)\s+drafts?/i);
  return match ? parseInt(match[1]) : 3;
}
