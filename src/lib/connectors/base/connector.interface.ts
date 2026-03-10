import type { ConnectorMeta, ConnectorExecuteInput, ConnectorExecuteOutput } from "./connector.types";

export abstract class BaseConnector {
  abstract readonly meta: ConnectorMeta;

  abstract execute(input: ConnectorExecuteInput): Promise<ConnectorExecuteOutput>;

  getMeta(): ConnectorMeta {
    return this.meta;
  }

  supportsAction(action: string): boolean {
    return this.meta.supportedActions.some((a) => a.name === action);
  }
}
