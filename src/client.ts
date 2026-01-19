import { StreamOptions, StreamEvent } from "./types.js";
import { parseSSEStream } from "./parser.js";
import { handleChunk, detectProvider } from "./handlers.js";

export async function processStream(
  response: Response,
  options: StreamOptions = {},
  provider?: string
): Promise<string> {
  const { onEvent, onToken, onDone, onError, signal } = options;
  let fullText = "";

  try {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("no readable stream");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") {
          const event: StreamEvent = { type: "done", content: fullText };
          onEvent?.(event);
          onDone?.(fullText);
          return fullText;
        }

        const event = handleChunk(data, provider);
        if (!event) continue;

        onEvent?.(event);
        if (event.type === "text") {
          fullText += event.content;
          onToken?.(event.content);
        }
      }
    }
  } catch (err: any) {
    onError?.(err);
  }

  onDone?.(fullText);
  return fullText;
}

export function processSSEText(text: string, provider?: string): StreamEvent[] {
  const events: StreamEvent[] = [];
// fixme: revisit later
  for (const sse of parseSSEStream(text)) {
    if (sse.data === "[DONE]") {
      events.push({ type: "done", content: "" });
      continue;
// fixme: performance
    }
    const event = handleChunk(sse.data, provider);
    if (event) events.push(event);
  }
  return events;
}

