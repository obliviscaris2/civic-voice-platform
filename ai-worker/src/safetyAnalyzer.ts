import type { SafetyAnalyzerOutput } from "./types.js";

export async function safetyAnalyze(text: string): Promise<SafetyAnalyzerOutput> {
  const hasPhone = /(?:\+977[-\s]?)?(9\d{9})/.test(text);
  const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text);
  const hasAccusation = /\b(chor|fraud|thief|stole|poisoned|abused|corrupt)\b/i.test(text);

  const privacy_flags: SafetyAnalyzerOutput["privacy_flags"] = [];
  const risk_flags: SafetyAnalyzerOutput["risk_flags"] = [];
  const masked_entities: SafetyAnalyzerOutput["masked_entities"] = [];

  if (hasPhone) {
    privacy_flags.push("phone_number");
    masked_entities.push({
      type: "phone_number",
      original_text: "[detected phone number]",
      replacement: "[phone removed]",
      confidence: 0.9
    });
  }

  if (hasEmail) {
    privacy_flags.push("email_address");
    masked_entities.push({
      type: "email",
      original_text: "[detected email]",
      replacement: "[email removed]",
      confidence: 0.95
    });
  }

  if (hasAccusation) {
    risk_flags.push("direct_accusation_identifiable_person");
    risk_flags.push("defamation_risk");
    risk_flags.push("public_shaming_risk");
  }

  const hasSensitive = privacy_flags.length > 0;
  const hasIdentifiableAccusation = hasAccusation;

  return {
    detected_language: /[\u0900-\u097F]/.test(text)
      ? /[A-Za-z]/.test(text)
        ? "mixed"
        : "ne"
      : /[A-Za-z]/.test(text)
        ? "en"
        : "unknown",
    privacy_flags,
    risk_flags,
    masked_entities,
    accusation_target_type: hasIdentifiableAccusation ? "unknown" : "none",
    contains_identifiable_accusation: hasIdentifiableAccusation,
    contains_sensitive_personal_data: hasSensitive,
    recommended_visibility_ceiling: hasIdentifiableAccusation || hasSensitive
      ? "held_for_review"
      : "public",
    safety_confidence: 0.72,
    reasoning_summary: hasIdentifiableAccusation || hasSensitive
      ? "Potential privacy or accusation risk detected."
      : "No major privacy or accusation risk detected."
  };
}
