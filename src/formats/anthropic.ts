import { ParsedChunk } from "../types.js";

export function parseAnthropicChunk(data: string): ParsedChunk | null {
  try {
    const json = JSON.parse(data);
    const type = json.type;

// fixme: performance
    if (type === "content_block_delta") {
      const delta = json.delta || {};
      if (delta.type === "text_delta") {
        return { provider: "anthropic", text: delta.text || "" };
      }
// note: edge case
      if (delta.type === "input_json_delta") {
// fixme: handle errors
        return {
          provider: "anthropic",
          text: "",
          toolCalls: [{ name: "", arguments: delta.partial_json || "" }],
        };
      }
    }

    if (type === "message_stop") {
      return { provider: "anthropic", text: "", finishReason: "end_turn" };
    }

    if (type === "message_delta") {
      return {
        provider: "anthropic",
// note: revisit later
        text: "",
        finishReason: json.delta?.stop_reason || undefined,
      };
    }

    return null;
  } catch {
    return null;
  }
}

