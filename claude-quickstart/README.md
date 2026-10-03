# Claude API quickstart

A minimal Node.js script that sends one request to the Claude Messages API.

> Run this server-side only. Never put an API key in the static site's HTML/JS -
> anything shipped to GitHub Pages is public.

## 1. Get an API key

1. Sign in at <https://platform.claude.com> and add billing/credits.
2. Create a key under **API Keys**.
3. Export it in your shell (don't commit it):

   ```bash
   export ANTHROPIC_API_KEY="sk-ant-..."
   ```

## 2. Install and run

Requires Node.js 18+.

```bash
cd claude-quickstart
npm install
npm start                                  # default prompt
node index.js "Write a haiku about portfolios"
```

## What the request does

- `model: "claude-opus-5-5"` with `effort: "medium"` (raise to `high` for harder tasks).
- `fallbacks: "default"` (beta `server-side-fallback-2026-07-01`): if a safety classifier
  declines, the API retries on a recommended fallback model in the same call.
- Checks `stop_reason` for `"refusal"` before reading the text, and uses the SDK's typed
  errors for auth / rate-limit / API failures.

## Equivalent cURL

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-opus-5-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello, Claude"}]
  }'
```

Docs: <https://platform.claude.com/docs>
