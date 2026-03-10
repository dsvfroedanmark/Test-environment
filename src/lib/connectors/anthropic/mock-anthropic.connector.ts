import { BaseConnector } from "../base/connector.interface";
import type { ConnectorMeta, ConnectorExecuteInput, ConnectorExecuteOutput } from "../base/connector.types";
import type { DraftPost } from "@/types";

export class MockAnthropicConnector extends BaseConnector {
  readonly meta: ConnectorMeta = {
    name: "Anthropic (Claude)",
    type: "ANTHROPIC",
    description: "Uses Claude AI to generate content, plans, copy, and structured outputs.",
    isMock: true,
    authRequired: true,
    supportedActions: [
      { name: "generate_plan", description: "Generate a structured content plan", mode: "READ" },
      { name: "generate_copy", description: "Generate ad copy and captions", mode: "READ" },
      { name: "generate_schedule", description: "Generate a posting schedule", mode: "READ" },
      { name: "analyze", description: "Analyze data or text", mode: "READ" },
    ],
  };

  async execute(input: ConnectorExecuteInput): Promise<ConnectorExecuteOutput> {
    await delay(1200);

    switch (input.action) {
      case "generate_plan": {
        const brand = (input.params.brand as string) ?? "Brand";
        const postCount = (input.params.postCount as number) ?? 12;
        const days = (input.params.days as number) ?? 90;
        return {
          success: true,
          data: { plan: `${days}-day social media plan for ${brand}`, postsGenerated: postCount },
          artifacts: [
            {
              type: "DOCUMENT",
              title: `${brand} – ${days}-Day Social Media Plan`,
              description: `A structured content plan with ${postCount} posts`,
              content: {
                brand,
                totalPosts: postCount,
                periodDays: days,
                themes: [
                  "Product spotlight",
                  "Behind the scenes",
                  "Customer testimonial",
                  "Educational content",
                  "Seasonal promotion",
                  "Community engagement",
                ],
              },
            },
          ],
        };
      }

      case "generate_copy": {
        const postTopic = (input.params.topic as string) ?? "product";
        const platform = (input.params.platform as string) ?? "Instagram";
        const brand = (input.params.brand as string) ?? "Brand";
        const draftCount = (input.params.draftCount as number) ?? 3;

        const drafts: DraftPost[] = Array.from({ length: draftCount }, (_, i) => ({
          draftNumber: i + 1,
          adCopy: mockCopy(brand, postTopic, platform, i + 1),
          graphicDescription: mockGraphic(postTopic, i + 1),
          platform,
        }));

        return {
          success: true,
          data: { drafts },
          artifacts: [
            {
              type: "SOCIAL_POST",
              title: `${platform} Post Drafts – ${postTopic}`,
              description: `${draftCount} drafts for ${platform}`,
              content: { topic: postTopic, platform, drafts },
            },
          ],
        };
      }

      case "generate_schedule": {
        const brand = (input.params.brand as string) ?? "Brand";
        const postCount = (input.params.postCount as number) ?? 12;
        const start = new Date();
        const schedule = Array.from({ length: postCount }, (_, i) => {
          const d = new Date(start);
          d.setDate(d.getDate() + Math.floor((90 / postCount) * i));
          return {
            postNumber: i + 1,
            date: d.toISOString().split("T")[0],
            platform: i % 2 === 0 ? "Instagram" : "Facebook",
            theme: THEMES[i % THEMES.length],
          };
        });
        return {
          success: true,
          data: { schedule },
          artifacts: [
            {
              type: "DATA",
              title: `${brand} – Posting Schedule`,
              description: `${postCount} posts over 90 days`,
              content: { schedule },
            },
          ],
        };
      }

      default:
        return { success: false, error: `Unknown action: ${input.action}` };
    }
  }
}

const THEMES = [
  "Product spotlight",
  "Behind the scenes",
  "Customer testimonial",
  "Educational content",
  "Seasonal promotion",
  "Community engagement",
];

const COPY_VARIANTS = [
  (brand: string, topic: string) =>
    `Transform your outdoor space with ${brand}'s premium products. ${topic} — crafted for those who love nature. 🌿 #${brand} #NatureLiving`,
  (brand: string, topic: string) =>
    `🌱 ${brand} products are designed to work with nature. ${topic} — sustainable, beautiful, built to last. #Sustainable #${brand}`,
  (brand: string, topic: string) =>
    `Give your garden the upgrade it deserves. ${brand} brings you ${topic}. Tap to explore. 🌿✨`,
];

function mockCopy(brand: string, topic: string, _platform: string, draft: number): string {
  return COPY_VARIANTS[(draft - 1) % COPY_VARIANTS.length](brand, topic);
}

const GRAPHIC_VARIANTS = [
  (topic: string) =>
    `Clean product photography on natural background. Warm golden-hour lighting. Centered ${topic} with soft bokeh. Brand colors in corner.`,
  (topic: string) =>
    `Lifestyle shot showing ${topic} in real garden setting. Person interacting with product. Warm color grading. Vertical format.`,
  (topic: string) =>
    `Flat-lay composition with ${topic} surrounded by natural elements. Overhead shot. Earthy tones. Logo watermark top-right.`,
];

function mockGraphic(topic: string, draft: number): string {
  return GRAPHIC_VARIANTS[(draft - 1) % GRAPHIC_VARIANTS.length](topic);
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
