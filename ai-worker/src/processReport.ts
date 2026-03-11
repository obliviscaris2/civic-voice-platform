import { precheck } from "./precheck.js";
import { safetyAnalyze } from "./safetyAnalyzer.js";
import { structureReport } from "./structuringAnalyzer.js";
import { findSimilarReports } from "./similarityAnalyzer.js";
import { applyPolicy } from "./policyEngine.js";

async function processReport(text: string) {

  const pre = precheck(text);

  if (!pre.valid) {
    return { rejected: true, reason: pre.reason };
  }

  const safety = await safetyAnalyze(pre.text);

  const structured = await structureReport(pre.text);

  const similarity = await findSimilarReports(pre.text);

  const policy = applyPolicy({
    safety,
    structured,
    similarity
  });

  return {
    safety,
    structured,
    similarity,
    policy
  };

}


// example test

processReport("A dog has been abandoned in Ward 5 near the bus park")
  .then(console.log);
