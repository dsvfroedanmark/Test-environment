import type { ExecutionPlanData, PlanStep, ProposedConnector, ConnectorType } from "@/types";
import { REQUEST_TYPES } from "@/lib/constants/request-types";
import {
  detectPlatforms,
  extractBrand,
  extractPostCount,
  extractDays,
  extractDraftsPerPost,
} from "./planner.rules";

export function buildSocialMediaPlan(
  rawInput: string,
  enabledConnectors?: ConnectorType[]
): ExecutionPlanData {
  const brand = extractBrand(rawInput);
  const postCount = extractPostCount(rawInput);
  const days = extractDays(rawInput);
  const draftsPerPost = extractDraftsPerPost(rawInput);
  const platforms = detectPlatforms(rawInput);

  const allConnectors: ProposedConnector[] = [
    {
      type: "BROWSER",
      name: "Browser",
      reason: `Research ${brand} brand positioning, seasonal trends, and competitor content`,
      mode: "READ",
    },
    {
      type: "ANTHROPIC",
      name: "Anthropic (Claude)",
      reason: `Generate the ${days}-day content calendar, write ${draftsPerPost} ad copy drafts per post, and describe graphics`,
      mode: "READ",
    },
  ];

  if (platforms.includes("INSTAGRAM")) {
    allConnectors.push({
      type: "INSTAGRAM",
      name: "Instagram",
      reason: `Fetch the ${brand} Instagram profile metrics to inform content strategy`,
      mode: "READ",
    });
  }

  if (platforms.includes("FACEBOOK")) {
    allConnectors.push({
      type: "FACEBOOK",
      name: "Facebook",
      reason: `Fetch the ${brand} Facebook page metrics to inform content strategy`,
      mode: "READ",
    });
  }

  const proposedConnectors = enabledConnectors
    ? allConnectors.filter((c) => enabledConnectors.includes(c.type))
    : allConnectors;

  const steps = buildSteps(brand, postCount, days, draftsPerPost, platforms, proposedConnectors);

  return {
    requestType: REQUEST_TYPES.SOCIAL_MEDIA,
    interpretedGoal: `Create a ${days}-day social media content plan for ${brand} across ${platforms.join(" and ")}, with ${postCount} posts and ${draftsPerPost} drafts each (ad copy + graphic description).`,
    deliverables: [
      `${days}-day content calendar (${postCount} posts)`,
      `${postCount * draftsPerPost} post drafts with finished ad copy`,
      `${postCount * draftsPerPost} graphic descriptions`,
      "Recommended posting schedule",
    ],
    assumptions: [
      `Brand name is "${brand}"`,
      `Target platforms: ${platforms.join(", ")}`,
      `${postCount} posts over ${days} days (~${Math.round(days / postCount)} days between posts)`,
      `${draftsPerPost} drafts per post — client selects the best`,
      "Content focuses on webshop promotion and product highlights",
      "Graphics will be described for a designer to produce — not generated as image files in this MVP",
      "Posts will be scheduled, not published, until explicitly approved",
    ],
    proposedConnectors,
    steps,
    expectedOutputs: [
      `A structured ${days}-day content plan document`,
      `${postCount} post entries with topic, theme, and platform`,
      `${postCount * draftsPerPost} fully written ad copy drafts`,
      `${postCount * draftsPerPost} graphic concept descriptions`,
      "A posting schedule with recommended dates",
    ],
    requiresApproval: true,
  };
}

export function buildGenericPlan(rawInput: string): ExecutionPlanData {
  return {
    requestType: REQUEST_TYPES.GENERAL,
    interpretedGoal: rawInput,
    deliverables: ["Completed task output"],
    assumptions: ["Request will be executed as described"],
    proposedConnectors: [
      {
        type: "ANTHROPIC",
        name: "Anthropic (Claude)",
        reason: "Process and complete the requested task",
        mode: "READ",
      },
    ],
    steps: [
      {
        order: 1,
        name: "Process request",
        description: "Analyse and execute the user request",
        connectorType: "ANTHROPIC",
        actionMode: "READ",
        expectedOutput: "Task output",
      },
    ],
    expectedOutputs: ["Task result"],
    requiresApproval: true,
  };
}

function buildSteps(
  brand: string,
  postCount: number,
  days: number,
  draftsPerPost: number,
  platforms: ConnectorType[],
  connectors: ProposedConnector[]
): PlanStep[] {
  const steps: PlanStep[] = [];
  let order = 1;

  const has = (type: ConnectorType) => connectors.some((c) => c.type === type);

  if (has("BROWSER")) {
    steps.push({
      order: order++,
      name: "Research brand & trends",
      description: `Browse the web to research ${brand}'s positioning, seasonal trends, and social media best practices.`,
      connectorType: "BROWSER",
      actionMode: "READ",
      expectedOutput: "Research summary with key insights",
    });
  }

  if (has("INSTAGRAM") && platforms.includes("INSTAGRAM")) {
    steps.push({
      order: order++,
      name: "Fetch Instagram profile",
      description: `Retrieve the ${brand} Instagram profile to understand current metrics.`,
      connectorType: "INSTAGRAM",
      actionMode: "READ",
      expectedOutput: "Instagram profile data",
    });
  }

  if (has("FACEBOOK") && platforms.includes("FACEBOOK")) {
    steps.push({
      order: order++,
      name: "Fetch Facebook page",
      description: `Retrieve the ${brand} Facebook page metrics.`,
      connectorType: "FACEBOOK",
      actionMode: "READ",
      expectedOutput: "Facebook page data",
    });
  }

  if (has("ANTHROPIC")) {
    steps.push({
      order: order++,
      name: "Generate content calendar",
      description: `Create a structured ${days}-day content calendar for ${brand} with ${postCount} posts, assigning topics, themes, and platforms.`,
      connectorType: "ANTHROPIC",
      actionMode: "READ",
      expectedOutput: `Structured content calendar with ${postCount} entries`,
    });

    steps.push({
      order: order++,
      name: "Generate posting schedule",
      description: `Generate a recommended posting schedule distributing ${postCount} posts across ${days} days.`,
      connectorType: "ANTHROPIC",
      actionMode: "READ",
      expectedOutput: "Posting schedule with dates and platforms",
    });

    const batchSize = Math.min(postCount, 4);
    const batches = Math.ceil(postCount / batchSize);
    for (let b = 0; b < batches; b++) {
      const from = b * batchSize + 1;
      const to = Math.min((b + 1) * batchSize, postCount);
      steps.push({
        order: order++,
        name: `Generate ad copy – posts ${from}–${to}`,
        description: `Write ${draftsPerPost} ad copy drafts and graphic descriptions for posts ${from} through ${to}.`,
        connectorType: "ANTHROPIC",
        actionMode: "READ",
        expectedOutput: `${(to - from + 1) * draftsPerPost} post drafts with copy and graphic descriptions`,
      });
    }
  }

  return steps;
}
