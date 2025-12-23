import { ParsedChunk } from "../types.js";

export function parseGoogleChunk(data: string): ParsedChunk | null {
  try {
    const json = JSON.parse(data);
    const candidates = json.candidates;
    if (!candidates || !candidates.length) return null;

    const candidate = candidates[0];
    const parts = candidate.content?.parts || [];
    let text = "";
    for (const part of parts) {
      if (part.text) text += part.text;
    }

    return {
      provider: "google",
      text,
      finishReason: candidate.finishReason || undefined,
    };
  } catch {
    return null;
  }
}
