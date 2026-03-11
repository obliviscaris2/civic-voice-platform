import type { PrecheckOutput } from "./types.js";

export function precheck(
  text: string,
  options?: { hasImage?: boolean; hasLocation?: boolean }
): PrecheckOutput {
  const cleaned = text.trim();
  const hasImage = options?.hasImage ?? false;
  const hasLocation = options?.hasLocation ?? false;

  const heuristic_flags: string[] = [];
  let spam = 0.05;
  let quality = 0.7;

  const hasNepali = /[\u0900-\u097F]/.test(cleaned);
  const hasEnglish = /[A-Za-z]/.test(cleaned);

  const language_hint =
    hasNepali && hasEnglish ? "mixed" :
    hasNepali ? "ne" :
    hasEnglish ? "en" :
    "unknown";

  if (cleaned.length < 10) {
    return {
      valid: false,
      reason: "Report too short",
      language_hint,
      char_count: cleaned.length,
      has_image: hasImage,
      has_location: hasLocation,
      spam_heuristic_score: 0.5,
      quality_heuristic_score: 0.1,
      heuristic_flags: ["too_short"]
    };
  }

  if (/^(.)\1{8,}$/.test(cleaned.replace(/\s/g, ""))) {
    heuristic_flags.push("repeated_characters");
    spam = 0.8;
    quality = 0.1;
  }

  if (cleaned.length < 25) {
    heuristic_flags.push("low_context");
    quality = Math.min(quality, 0.4);
  }

  return {
    valid: true,
    language_hint,
    normalized_text: cleaned,
    char_count: cleaned.length,
    has_image: hasImage,
    has_location: hasLocation,
    spam_heuristic_score: spam,
    quality_heuristic_score: quality,
    heuristic_flags
  };
}
