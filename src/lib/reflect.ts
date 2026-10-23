export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

export const REFLECT_SYSTEM = [
  "You are LUNORA's gentle reflection companion.",
  "The user is weighing two options and shared what matters most to them.",
  "Reply with one short, warm, balanced reflection question that helps them compare the options against what matters to them.",
  "Never recommend, rank, or choose an option. Never give advice or verdicts.",
  "Keep it under 40 words, plain and kind.",
].join(" ");

/** Two distinct, non-empty options are required. */
export function validReflectionInput(a: string, b: string): boolean {
  const x = a.trim();
  const y = b.trim();
  return x.length > 0 && y.length > 0 && x.toLowerCase() !== y.toLowerCase();
}

/** Build the chat messages sent to the local model from explicitly submitted text only. */
export function buildReflectionMessages(a: string, b: string, matters: string): ChatMessage[] {
  const lines = [`Option A: ${a.trim()}`, `Option B: ${b.trim()}`];
  const m = matters.trim();
  if (m) lines.push(`What matters most to me: ${m}`);
  lines.push("Ask me one short reflection question that helps me compare these options against what matters to me. Do not choose for me.");
  return [
    { role: "system", content: REFLECT_SYSTEM },
    { role: "user", content: lines.join("\n") },
  ];
}
