import { getOpenAIClient } from "./openaiClient.js";
import { config } from "./config.js";
import { buildStructuringPrompt } from "./promptTemplates.js";
import { StructuringAnalyzerOutputSchema } from "./schemas.js";
import type { StructuringAnalyzerOutput } from "./types.js";

function fallbackStructure(text: string): StructuringAnalyzerOutput {
  const compact = text.trim().replace(/\s+/g, " ");

  return {
    title: compact.length > 70 ? `${compact.slice(0, 67)}...` : compact,
    summary_ne: compact,
    summary_en: compact,
    safe_public_text: compact,
    category: "other",
    category_confidence: 0.35,
    severity: "medium",
    severity_score: 0.5,
    severity_confidence: 0.35,
    tags: ["community-report"],
    authority_type: "municipality_office",
    authority_confidence: 0.4,
    actionability_score: compact.length > 20 ? 0.6 : 0.2,
    quality_flags: compact.length > 20 ? ["good_quality"] : ["missing_actionable_detail"],
    structuring_confidence: 0.4
  };
}

export async function structureReport(text: string): Promise<StructuringAnalyzerOutput> {
  try {
    const client = getOpenAIClient();

    const response = await client.responses.create({
      model: config.openaiModel,
      input: buildStructuringPrompt(text)
    });

    const raw = response.output_text;
    const parsed = JSON.parse(raw);
    return StructuringAnalyzerOutputSchema.parse(parsed);
  } catch (error) {
    console.error("structureReport fallback:", error);
    return fallbackStructure(text);
  }
}
