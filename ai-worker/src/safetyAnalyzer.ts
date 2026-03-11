import { z } from "zod";
import { getOpenAIClient } from "./openaiClient.js";
import { config } from "./config.js";
import { buildSafetyPrompt } from "./promptTemplates.js";
import { SafetyAnalyzerOutputSchema } from "./schemas.js";
import type { SafetyAnalyzerOutput } from "./types.js";

function fallbackSafety(text: string): SafetyAnalyzerOutput {
  const hasPhone = /(?:\+977[-\s]?)?(9\d{9})/.test(text);

  return {
    detected_language: /[\u0900-\u097F]/.test(text)
      ? /[A-Za-z]/.test(text)
        ? "mixed"
        : "ne"
      : /[A-Za-z]/.test(text)
        ? "en"
        : "unknown",
    privacy_flags: hasPhone ? ["phone_number"] : [],
    risk_flags: [],
    masked_entities: hasPhone
      ? [
          {
            type: "phone_number",
            original_text: "[detected phone number]",
            replacement: "[phone removed]",
            confidence: 0.8
          }
        ]
      : [],
    accusation_target_type: "none",
    contains_identifiable_accusation: false,
    contains_sensitive_personal_data: hasPhone,
    recommended_visibility_ceiling: hasPhone ? "held_for_review" : "public",
    safety_confidence: 0.45,
    reasoning_summary: hasPhone
      ? "Fallback detected possible phone number."
      : "Fallback detected no major safety issue."
  };
}

export async function safetyAnalyze(text: string): Promise<SafetyAnalyzerOutput> {
  try {
    const client = getOpenAIClient();

    const response = await client.responses.create({
      model: config.openaiModel,
      input: buildSafetyPrompt(text)
    });

    const raw = response.output_text;
    const parsed = JSON.parse(raw);
    return SafetyAnalyzerOutputSchema.parse(parsed);
  } catch (error) {
    console.error("safetyAnalyze fallback:", error);
    return fallbackSafety(text);
  }
}
