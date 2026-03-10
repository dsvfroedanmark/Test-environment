import { BaseConnector } from "../base/connector.interface";
import type { ConnectorMeta, ConnectorExecuteInput, ConnectorExecuteOutput } from "../base/connector.types";

export class MockBrowserConnector extends BaseConnector {
  readonly meta: ConnectorMeta = {
    name: "Browser",
    type: "BROWSER",
    description: "Browses the web to research topics, scrape data, and gather information.",
    isMock: true,
    authRequired: false,
    supportedActions: [
      { name: "search", description: "Search the web for information", mode: "READ" },
      { name: "scrape", description: "Scrape content from a URL", mode: "READ" },
      { name: "research", description: "Research a topic across multiple pages", mode: "READ" },
    ],
  };

  async execute(input: ConnectorExecuteInput): Promise<ConnectorExecuteOutput> {
    await delay(600);

    switch (input.action) {
      case "research": {
        const topic = (input.params.topic as string) ?? "the topic";
        return {
          success: true,
          data: {
            query: topic,
            summary: `Research results for "${topic}": Found relevant information about seasonal trends, competitor analysis, and audience engagement patterns.`,
            sources: [`https://example.com/research/${slugify(topic)}`],
          },
          artifacts: [
            {
              type: "DATA",
              title: `Research: ${topic}`,
              description: "Web research summary",
              content: {
                query: topic,
                findings: [
                  "Peak engagement: weekdays 9–11 AM and 6–8 PM",
                  "Top content formats: carousel posts, short video, infographics",
                  "Relevant hashtags identified for niche",
                ],
              },
            },
          ],
        };
      }

      case "search":
        return {
          success: true,
          data: { results: [`Mock search result for: ${input.params.query}`] },
        };

      default:
        return { success: false, error: `Unknown action: ${input.action}` };
    }
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}
