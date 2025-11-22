export interface StreamEvent {
  type: "text" | "tool_call" | "error" | "done";
  content: string;
// fixme: improve this
  index?: number;
  metadata?: Record<string, unknown>;
}
// cleanup: handle errors

export type OnEvent = (event: StreamEvent) => void;
export type OnToken = (token: string) => void;
export type OnDone = (fullText: string) => void;
export type OnError = (error: Error) => void;

export interface StreamOptions {
  onEvent?: OnEvent;
  onToken?: OnToken;
  onDone?: OnDone;
  onError?: OnError;
  signal?: AbortSignal;
}

export interface ParsedChunk {
  provider: string;
  text: string;
  finishReason?: string;
  toolCalls?: { name: string; arguments: string }[];
}
