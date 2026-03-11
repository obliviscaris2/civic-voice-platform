export async function safetyAnalyze(text: string) {

  // placeholder logic for now

  const containsPhone = /\d{10}/.test(text);
  const containsName = /Mr\.|Mrs\.|Dr\./.test(text);

  return {
    containsPrivateInfo: containsPhone || containsName,
    riskLevel: containsPhone ? "high" : "low"
  };

}
