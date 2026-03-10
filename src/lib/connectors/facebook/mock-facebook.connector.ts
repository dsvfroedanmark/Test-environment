import { BaseConnector } from "../base/connector.interface";
import type { ConnectorMeta, ConnectorExecuteInput, ConnectorExecuteOutput } from "../base/connector.types";

export class MockFacebookConnector extends BaseConnector {
  readonly meta: ConnectorMeta = {
    name: "Facebook",
    type: "FACEBOOK",
    description: "Publishes posts to Facebook pages and manages page content.",
    isMock: true,
    authRequired: true,
    supportedActions: [
      { name: "get_page", description: "Fetch page information", mode: "READ" },
      { name: "get_posts", description: "List recent page posts", mode: "READ" },
      { name: "schedule_post", description: "Schedule a post for publishing", mode: "WRITE" },
      { name: "publish_post", description: "Publish a post immediately", mode: "WRITE" },
    ],
  };

  async execute(input: ConnectorExecuteInput): Promise<ConnectorExecuteOutput> {
    await delay(800);

    switch (input.action) {
      case "get_page": {
        const pageName = (input.params.pageName as string) ?? "page";
        return {
          success: true,
          data: {
            pageName,
            likesCount: 3210,
            followersCount: 3480,
            category: "Lawn & Garden",
            rating: 4.8,
          },
        };
      }

      case "schedule_post":
        return {
          success: true,
          data: {
            postId: `mock_fb_${Date.now()}`,
            scheduledFor: input.params.scheduledDate,
            status: "SCHEDULED",
            platform: "Facebook",
          },
        };

      default:
        return { success: false, error: `Unknown action: ${input.action}` };
    }
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
