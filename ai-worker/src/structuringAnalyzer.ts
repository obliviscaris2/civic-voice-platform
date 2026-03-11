import type { StructuringAnalyzerOutput, Category, Severity, AuthorityType } from "./types.js";

function inferCategory(text: string): Category {
  const t = text.toLowerCase();

  if (/(dog|cat|animal|kukur|biralo)/i.test(t)) return "animal_welfare";
  if (/(water|pani|pipe|dhara)/i.test(t)) return "water_supply";
  if (/(garbage|waste|fohor|sanitation)/i.test(t)) return "sanitation_waste";
  if (/(road|bato|pothole|gaddha)/i.test(t)) return "road_infrastructure";
  if (/(hospital|health|birami|doctor)/i.test(t)) return "health_public";
  if (/(electricity|power|batti|line)/i.test(t)) return "electricity_utility";

  return "other";
}

function inferSeverity(text: string): { severity: Severity; score: number } {
  const t = text.toLowerCase();

  if (/(injured|ghayal|bleeding|danger|marera|dead|emergency)/i.test(t)) {
    return { severity: "high", score: 0.75 };
  }

  if (/(urgent|severe|weeks|3 din|several days)/i.test(t)) {
    return { severity: "medium", score: 0.55 };
  }

  return { severity: "low", score: 0.2 };
}

function inferAuthority(category: Category): AuthorityType {
  switch (category) {
    case "animal_welfare":
      return "animal_response";
    case "water_supply":
      return "water_department";
    case "sanitation_waste":
      return "sanitation_department";
    case "road_infrastructure":
      return "road_maintenance";
    case "health_public":
      return "public_health_office";
    case "electricity_utility":
      return "electricity_authority";
    default:
      return "municipality_office";
  }
}

export async function structureReport(text: string): Promise<StructuringAnalyzerOutput> {
  const category = inferCategory(text);
  const severityInfo = inferSeverity(text);
  const authority = inferAuthority(category);

  const compact = text.trim().replace(/\s+/g, " ");
  const title = compact.length > 70 ? `${compact.slice(0, 67)}...` : compact;

  return {
    title,
    summary_ne: compact,
    summary_en: compact,
    safe_public_text: compact,
    category,
    category_confidence: 0.7,
    severity: severityInfo.severity,
    severity_score: severityInfo.score,
    severity_confidence: 0.65,
    tags: [category.replaceAll("_", "-")],
    authority_type: authority,
    authority_confidence: 0.68,
    actionability_score: compact.length > 20 ? 0.7 : 0.3,
    quality_flags: compact.length > 20 ? ["good_quality"] : ["missing_actionable_detail"],
    structuring_confidence: 0.66
  };
}
