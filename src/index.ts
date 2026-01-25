export { processStream, processSSEText } from "./client.js";
export { parseSSELine, parseSSEStream } from "./parser.js";
export { handleChunk, detectProvider } from "./handlers.js";
export { parseOpenAIChunk } from "./formats/openai.js";
export { parseAnthropicChunk } from "./formats/anthropic.js";
export { parseGoogleChunk } from "./formats/google.js";
export type { StreamEvent, StreamOptions, ParsedChunk, OnToken, OnDone, OnError } from "./types.js";

