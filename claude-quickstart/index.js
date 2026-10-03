// Minimal Claude Messages API request.
// Reads credentials from ANTHROPIC_API_KEY (never hardcode or commit a key).
import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
  console.error("No credentials found. Set ANTHROPIC_API_KEY (see README.md).");
  process.exit(1);
}

const client = new Anthropic();
const prompt = process.argv.slice(2).join(" ") || "Hello, Claude! Introduce yourself in two sentences.";

try {
  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { effort: "medium" },
    // Server-side fallback: if a safety classifier declines the request,
    // the API re-runs it on Anthropic's recommended fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    messages: [{ role: "user", content: prompt }],
  });

  if (response.stop_reason === "refusal") {
    console.error("Request was declined:", response.stop_details?.category ?? "unspecified");
    process.exit(1);
  }

  for (const block of response.content) {
    if (block.type === "text") console.log(block.text);
  }
  console.error(
    `\n[model: ${response.model} | in: ${response.usage.input_tokens} | out: ${response.usage.output_tokens} tokens]`,
  );
} catch (error) {
  if (error instanceof Anthropic.AuthenticationError) {
    console.error("Invalid or missing API key - set ANTHROPIC_API_KEY.");
  } else if (error instanceof Anthropic.RateLimitError) {
    console.error("Rate limited - retry later.");
  } else if (error instanceof Anthropic.APIError) {
    console.error(`API error ${error.status}:`, error.message);
  } else {
    throw error;
  }
  process.exit(1);
}
