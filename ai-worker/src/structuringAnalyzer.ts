export async function structureReport(text: string) {

  return {
    title: text.slice(0, 50),
    summary: text,
    category: "general",
    tags: ["community"],
    severity: "medium"
  };

}
