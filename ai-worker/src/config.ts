export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini"
};

export function assertConfig() {
  if (!config.openaiApiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
}
