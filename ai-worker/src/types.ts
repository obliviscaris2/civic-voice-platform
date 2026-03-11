export type Category =
  | "road_infrastructure"
  | "water_supply"
  | "sanitation_waste"
  | "animal_welfare"
  | "health_public"
  | "environment"
  | "public_safety"
  | "electricity_utility"
  | "education_public"
  | "government_service"
  | "social_issue"
  | "corruption_sensitive"
  | "other";

export type Severity = "low" | "medium" | "high" | "critical";

export type Visibility =
  | "public"
  | "public_limited"
  | "restricted_sensitive"
  | "held_for_review"
  | "rejected_spam";

export type AuthorityType =
  | "ward_office"
  | "municipality_office"
  | "district_office"
  | "road_maintenance"
  | "water_department"
  | "sanitation_department"
  | "animal_response"
  | "public_health_office"
  | "electricity_authority"
  | "police_or_safety"
  | "anti_corruption_or_sensitive_review"
  | "unknown";

export type PrivacyFlag =
  | "private_person_name"
  | "phone_number"
  | "email_address"
  | "home_address"
  | "precise_sensitive_location"
  | "government_id_or_account_info"
  | "child_identity_exposure";

export type RiskFlag =
  | "direct_accusation_identifiable_person"
  | "defamation_risk"
  | "public_shaming_risk"
  | "harassment_or_targeting"
  | "hate_or_communal_risk"
  | "threat_or_incitement"
  | "graphic_or_disturbing"
  | "self_harm_or_immediate_danger"
  | "medical_claim_high_risk"
  | "corruption_sensitive_claim"
  | "revenge_posting_pattern"
  | "spam_likely"
  | "gibberish_or_low_signal";

export type QualityFlag =
  | "too_short"
  | "unclear_issue"
  | "missing_location_context"
  | "missing_actionable_detail"
  | "likely_duplicate"
  | "highly_emotional_low_detail"
  | "good_quality";

export type PrecheckOutput = {
  valid: boolean;
  reason?: string;
  language_hint: "ne" | "en" | "mixed" | "unknown";
  normalized_text?: string;
  char_count: number;
  has_image: boolean;
  has_location: boolean;
  spam_heuristic_score: number;
  quality_heuristic_score: number;
  heuristic_flags: string[];
};

export type SafetyAnalyzerOutput = {
  detected_language: "ne" | "en" | "mixed" | "unknown";
  privacy_flags: PrivacyFlag[];
  risk_flags: RiskFlag[];
  masked_entities: Array<{
    type:
      | "person_name"
      | "phone_number"
      | "email"
      | "address"
      | "government_id"
      | "other_sensitive";
    original_text: string;
    replacement: string;
    confidence: number;
  }>;
  accusation_target_type: "none" | "private_person" | "public_official" | "unknown";
  contains_identifiable_accusation: boolean;
  contains_sensitive_personal_data: boolean;
  recommended_visibility_ceiling:
    | "public"
    | "public_limited"
    | "restricted_sensitive"
    | "held_for_review";
  safety_confidence: number;
  reasoning_summary: string;
};

export type StructuringAnalyzerOutput = {
  title: string;
  summary_ne: string;
  summary_en: string;
  safe_public_text: string;
  category: Category;
  category_confidence: number;
  severity: Severity;
  severity_score: number;
  severity_confidence: number;
  tags: string[];
  authority_type: AuthorityType;
  authority_confidence: number;
  actionability_score: number;
  quality_flags: QualityFlag[];
  structuring_confidence: number;
};

export type SimilarityAnalyzerOutput = {
  duplicate_candidates: Array<{
    report_id: string;
    similarity_score: number;
    same_area: boolean;
    same_category: boolean;
    created_within_hours: number;
  }>;
  likely_duplicate: boolean;
  likely_clustered_issue: boolean;
  cluster_confidence: number;
  cluster_key: string | null;
};

export type FinalPolicyDecision = {
  final_visibility: Visibility;
  publishable: boolean;
  exact_location_public: boolean;
  allow_in_feed: boolean;
  requires_human_review: boolean;
  auto_mask_applied: boolean;
  auto_cluster_candidate: boolean;
  moderation_priority: "low" | "medium" | "high" | "critical";
  final_reason_codes: string[];
  decision_summary: string;
};
