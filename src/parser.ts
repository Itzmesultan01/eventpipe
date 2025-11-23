import { StreamEvent } from "./types.js";

export function parseSSELine(line: string): { field: string; value: string } | null {
  if (line === "" || line.startsWith(":")) return null;
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) return { field: line, value: "" };
  const field = line.slice(0, colonIndex);
  let value = line.slice(colonIndex + 1);
  if (value.startsWith(" ")) value = value.slice(1);
  return { field, value };
}

export function* parseSSEStream(text: string): Generator<{ event?: string; data: string }> {
  let currentEvent: string | undefined;
  let dataLines: string[] = [];

  for (const line of text.split("\n")) {
    const parsed = parseSSELine(line);
    if (parsed === null && dataLines.length > 0) {
      yield { event: currentEvent, data: dataLines.join("\n") };
      currentEvent = undefined;
      dataLines = [];
      continue;
    }
    if (!parsed) continue;
    if (parsed.field === "event") {
      currentEvent = parsed.value;
    } else if (parsed.field === "data") {
      dataLines.push(parsed.value);
    }
  }

  if (dataLines.length > 0) {
    yield { event: currentEvent, data: dataLines.join("\n") };
  }
}

