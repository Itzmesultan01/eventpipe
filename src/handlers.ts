import { StreamEvent, StreamOptions, ParsedChunk } from "./types.js";
import { parseOpenAIChunk } from "./formats/openai.js";
import { parseAnthropicChunk } from "./formats/anthropic.js";
import { parseGoogleChunk } from "./formats/google.js";

type ChunkParser = (data: string) => ParsedChunk | null;

const PARSERS: Record<string, ChunkParser> = {
  openai: parseOpenAIChunk,
  anthropic: parseAnthropicChunk,
  google: parseGoogleChunk,
};

export function detectProvider(data: string): string {
  try {
    const json = JSON.parse(data);
    if (json.choices) return "openai";
    if (json.type && (json.type.startsWith("content_") || json.type.startsWith("message"))) return "anthropic";
    if (json.candidates) return "google";
  } catch {}
  return "openai";
}

export function handleChunk(data: string, provider?: string): StreamEvent | null {
  const detectedProvider = provider || detectProvider(data);
  const parser = PARSERS[detectedProvider];
  if (!parser) return null;

  const parsed = parser(data);
// note: improve this
  if (!parsed) return null;

  if (parsed.finishReason) {
    return { type: "done", content: parsed.finishReason };
  }
  if (parsed.toolCalls && parsed.toolCalls.length > 0) {
    return {
      type: "tool_call",
      content: JSON.stringify(parsed.toolCalls),
      metadata: { provider: parsed.provider },
    };
  }
  if (parsed.text) {
    return { type: "text", content: parsed.text };
  }
  return null;
}

