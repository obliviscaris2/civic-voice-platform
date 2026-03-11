import type {
  PrecheckOutput,
  SafetyAnalyzerOutput,
  StructuringAnalyzerOutput,
  SimilarityAnalyzerOutput,
  FinalPolicyDecision
} from "./types.js";

type PolicyInput = {
  precheck: PrecheckOutput;
  safety: SafetyAnalyzerOutput;
  structured: StructuringAnalyzerOutput;
  similarity: SimilarityAnalyzerOutput;
};

export function applyPolicy(input: PolicyInput): FinalPolicyDecision {
  const reasons: string[] = [];

  if (!input.precheck.valid) {
    return {
      final_visibility: "rejected_spam",
      publishable: false,
      exact_location_public: false,
      allow_in_feed: false,
      requires_human_review: false,
      auto_mask_applied: false,
      auto_cluster_candidate: false,
      moderation_priority: "low",
      final_reason_codes: ["invalid_precheck"],
      decision_summary: input.precheck.reason ?? "Rejected during precheck."
    };
  }

  if (input.precheck.spam_heuristic_score >= 0.8) {
    return {
      final_visibility: "rejected_spam",
      publishable: false,
      exact_location_public: false,
      allow_in_feed: false,
      requires_human_review: false,
      auto_mask_applied: false,
      auto_cluster_candidate: false,
      moderation_priority: "low",
      final_reason_codes: ["spam_heuristic_high"],
      decision_summary: "Rejected as likely spam."
    };
  }

  if (
    input.safety.contains_identifiable_accusation ||
    input.safety.privacy_flags.length > 0 ||
    input.safety.risk_flags.includes("defamation_risk") ||
    input.safety.risk_flags.includes("hate_or_communal_risk") ||
    input.safety.risk_flags.includes("threat_or_incitement")
  ) {
    reasons.push(...input.safety.privacy_flags, ...input.safety.risk_flags);

    return {
      final_visibility: "held_for_review",
      publishable: false,
      exact_location_public: false,
      allow_in_feed: false,
      requires_human_review: true,
      auto_mask_applied: input.safety.masked_entities.length > 0,
      auto_cluster_candidate: input.similarity.likely_clustered_issue,
      moderation_priority: "high",
      final_reason_codes: reasons,
      decision_summary: "Held for review due to privacy or safety risk."
    };
  }

  if (input.precheck.quality_heuristic_score < 0.35) {
    return {
      final_visibility: "public_limited",
      publishable: true,
      exact_location_public: false,
      allow_in_feed: true,
      requires_human_review: false,
      auto_mask_applied: false,
      auto_cluster_candidate: input.similarity.likely_clustered_issue,
      moderation_priority: "medium",
      final_reason_codes: ["low_quality_limited_visibility"],
      decision_summary: "Published with limited visibility due to low detail."
    };
  }

  return {
    final_visibility: "public",
    publishable: true,
    exact_location_public: true,
    allow_in_feed: true,
    requires_human_review: false,
    auto_mask_applied: input.safety.masked_entities.length > 0,
    auto_cluster_candidate: input.similarity.likely_clustered_issue,
    moderation_priority: input.structured.severity === "critical" ? "critical" : "low",
    final_reason_codes: ["safe_to_publish"],
    decision_summary: "Published normally."
  };
}
