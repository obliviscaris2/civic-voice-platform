import { precheck } from "./precheck.js";
import { safetyAnalyze } from "./safetyAnalyzer.js";
import { structureReport } from "./structuringAnalyzer.js";
import { findSimilarReports } from "./similarityAnalyzer.js";
import { applyPolicy } from "./policyEngine.js";

async function processReport(
  text: string,
  options?: { hasImage?: boolean; hasLocation?: boolean }
) {
  const pre = precheck(text, options);

  if (!pre.valid) {
    return {
      precheck: pre,
      rejected: true,
      reason: pre.reason
    };
  }

  const safety = await safetyAnalyze(pre.normalized_text!);
  const structured = await structureReport(pre.normalized_text!);
  const similarity = await findSimilarReports(pre.normalized_text!);

  const policy = applyPolicy({
    precheck: pre,
    safety,
    structured,
    similarity
  });

  return {
    precheck: pre,
    safety,
    structured,
    similarity,
    policy
  };
}

processReport("A dog has been abandoned in Ward 5 near the bus park", {
  hasImage: false,
  hasLocation: true
}).then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
