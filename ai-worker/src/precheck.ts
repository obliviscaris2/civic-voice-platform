export function precheck(text: string) {
  const cleaned = text.trim();

  if (cleaned.length < 10) {
    return {
      valid: false,
      reason: "Report too short"
    };
  }

  return {
    valid: true,
    text: cleaned
  };
}
