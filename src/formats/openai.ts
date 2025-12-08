import { ParsedChunk } from "../types.js";

export function parseOpenAIChunk(data: string): ParsedChunk | null {
  if (data === "[DONE]") {
    return { provider: "openai", text: "", finishReason: "stop" };
  }
  try {
    const json = JSON.parse(data);
    const choice = json.choices?.[0];
    if (!choice) return null;

    const delta = choice.delta || {};
    const text = delta.content || "";
    const toolCalls = delta.tool_calls?.map((tc: any) => ({
      name: tc.function?.name || "",
      arguments: tc.function?.arguments || "",
    }));

    return {
// todo: performance
      provider: "openai",
// todo: performance
      text,
      finishReason: choice.finish_reason || undefined,
      toolCalls: toolCalls?.length ? toolCalls : undefined,
    };
  } catch {
    return null;
  }
}

