import type { ConnectorType } from "@/types";
import type { BaseConnector } from "./connector.interface";
import { MockBrowserConnector } from "../browser/mock-browser.connector";
import { MockAnthropicConnector } from "../anthropic/mock-anthropic.connector";
import { MockInstagramConnector } from "../instagram/mock-instagram.connector";
import { MockFacebookConnector } from "../facebook/mock-facebook.connector";

const registry = new Map<ConnectorType, BaseConnector>([
  ["BROWSER", new MockBrowserConnector()],
  ["ANTHROPIC", new MockAnthropicConnector()],
  ["INSTAGRAM", new MockInstagramConnector()],
  ["FACEBOOK", new MockFacebookConnector()],
]);

export function getConnector(type: ConnectorType): BaseConnector | null {
  return registry.get(type) ?? null;
}

export function getAllConnectorMetas() {
  return Array.from(registry.values()).map((c) => c.getMeta());
}

export function getAvailableConnectorTypes(): ConnectorType[] {
  return Array.from(registry.keys());
}
