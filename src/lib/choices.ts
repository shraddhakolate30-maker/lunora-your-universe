export function choiceOptions(mode: "yesno" | "custom", custom: string[]) {
  return mode === "yesno" ? ["Yes", "No"] : custom.map((s) => s.trim()).filter(Boolean);
}
export function validOptions(options: string[]) {
  return options.length >= 2 && new Set(options.map((s) => s.toLowerCase())).size === options.length;
}

/** Randomly assign two options to two chits so the user cannot guess. */
export function assignChits(a: string, b: string, rand: (n: number) => number): [string, string] {
  return rand(2) === 0 ? [a, b] : [b, a];
}
