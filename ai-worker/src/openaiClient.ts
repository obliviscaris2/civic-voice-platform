import OpenAI from "openai";
import { assertConfig, config } from "./config.js";

let client: OpenAI | null = null;

export function getOpenAIClient() {
  assertConfig();

  if (!client) {
    client = new OpenAI({
      apiKey: config.openaiApiKey
    });
  }

  return client;
}
