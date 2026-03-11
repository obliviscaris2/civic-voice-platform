import type { SimilarityAnalyzerOutput } from "./types.js";

export async function findSimilarReports(_text: string): Promise<SimilarityAnalyzerOutput> {
  return {
    duplicate_candidates: [],
    likely_duplicate: false,
    likely_clustered_issue: false,
    cluster_confidence: 0.1,
    cluster_key: null
  };
}
