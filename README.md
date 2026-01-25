# eventpipe

SSE streaming library for LLM responses. Parses Server-Sent Events from OpenAI, Anthropic and Google, normalizes into a common format.

## Install

```
npm install
npm run build
```

## Usage

```typescript
import { processStream } from "eventpipe";

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  body: JSON.stringify({ model: "gpt-4o", messages: [...], stream: true }),
});

const text = await processStream(response, {
  onToken: (token) => process.stdout.write(token),
  onDone: (full) => console.log("\n---done---"),
  onError: (err) => console.error(err),
});
```

Auto-detects provider from response format. Pass `provider` param to skip detection.

## License

MIT


