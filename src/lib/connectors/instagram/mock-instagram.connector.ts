import { BaseConnector } from "../base/connector.interface";
import type { ConnectorMeta, ConnectorExecuteInput, ConnectorExecuteOutput } from "../base/connector.types";

export class MockInstagramConnector extends BaseConnector {
  readonly meta: ConnectorMeta = {
    name: "Instagram",
    type: "INSTAGRAM",
    description: "Publishes posts and stories to Instagram business accounts.",
    isMock: true,
    authRequired: true,
    supportedActions: [
      { name: "get_profile", description: "Fetch profile information", mode: "READ" },
      { name: "get_posts", description: "List recent posts", mode: "READ" },
      { name: "schedule_post", description: "Schedule a post for publishing", mode: "WRITE" },
      { name: "publish_post", description: "Publish a post immediately", mode: "WRITE" },
    ],
  };

  async execute(input: ConnectorExecuteInput): Promise<ConnectorExecuteOutput> {
    await delay(800);

    switch (input.action) {
      case "get_profile": {
        const profileName = (input.params.profileName as string) ?? "profile";
        return {
          success: true,
          data: {
            username: profileName,
            followersCount: 4820,
            followingCount: 312,
            postsCount: 187,
            bio: "Premium lawn & garden products 🌿 | Natural. Sustainable. Beautiful.",
          },
        };
      }

      case "schedule_post":
        return {
          success: true,
          data: {
            postId: `mock_ig_${Date.now()}`,
            scheduledFor: input.params.scheduledDate,
            status: "SCHEDULED",
            platform: "Instagram",
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
