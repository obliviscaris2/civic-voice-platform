import { z } from "zod";

export const PrecheckOutputSchema = z.object({
  valid: z.boolean(),
  reason: z.string().optional(),
  language_hint: z.enum(["ne", "en", "mixed", "unknown"]),
  normalized_text: z.string().optional(),
  char_count: z.number(),
  has_image: z.boolean(),
  has_location: z.boolean(),
  spam_heuristic_score: z.number().min(0).max(1),
  quality_heuristic_score: z.number().min(0).max(1),
  heuristic_flags: z.array(z.string())
});

export const SafetyAnalyzerOutputSchema = z.object({
  detected_language: z.enum(["ne", "en", "mixed", "unknown"]),
  privacy_flags: z.array(z.string()),
  risk_flags: z.array(z.string()),
  masked_entities: z.array(
    z.object({
      type: z.enum([
        "person_name",
        "phone_number",
        "email",
        "address",
        "government_id",
        "other_sensitive"
      ]),
      original_text: z.string(),
      replacement: z.string(),
      confidence: z.number().min(0).max(1)
    })
  ),
  accusation_target_type: z.enum(["none", "private_person", "public_official", "unknown"]),
  contains_identifiable_accusation: z.boolean(),
  contains_sensitive_personal_data: z.boolean(),
  recommended_visibility_ceiling: z.enum([
    "public",
    "public_limited",
    "restricted_sensitive",
    "held_for_review"
  ]),
  safety_confidence: z.number().min(0).max(1),
  reasoning_summary: z.string()
});

export const StructuringAnalyzerOutputSchema = z.object({
  title: z.string(),
  summary_ne: z.string(),
  summary_en: z.string(),
  safe_public_text: z.string(),
  category: z.string(),
  category_confidence: z.number().min(0).max(1),
  severity: z.enum(["low", "medium", "high", "critical"]),
  severity_score: z.number().min(0).max(1),
  severity_confidence: z.number().min(0).max(1),
  tags: z.array(z.string()),
  authority_type: z.string(),
  authority_confidence: z.number().min(0).max(1),
  actionability_score: z.number().min(0).max(1),
  quality_flags: z.array(z.string()),
  structuring_confidence: z.number().min(0).max(1)
});

export const SimilarityAnalyzerOutputSchema = z.object({
  duplicate_candidates: z.array(
    z.object({
      report_id: z.string(),
      similarity_score: z.number().min(0).max(1),
      same_area: z.boolean(),
      same_category: z.boolean(),
      created_within_hours: z.number()
    })
  ),
  likely_duplicate: z.boolean(),
  likely_clustered_issue: z.boolean(),
  cluster_confidence: z.number().min(0).max(1),
  cluster_key: z.string().nullable()
});

export const FinalPolicyDecisionSchema = z.object({
  final_visibility: z.enum([
    "public",
    "public_limited",
    "restricted_sensitive",
    "held_for_review",
    "rejected_spam"
  ]),
  publishable: z.boolean(),
  exact_location_public: z.boolean(),
  allow_in_feed: z.boolean(),
  requires_human_review: z.boolean(),
  auto_mask_applied: z.boolean(),
  auto_cluster_candidate: z.boolean(),
  moderation_priority: z.enum(["low", "medium", "high", "critical"]),
  final_reason_codes: z.array(z.string()),
  decision_summary: z.string()
});
