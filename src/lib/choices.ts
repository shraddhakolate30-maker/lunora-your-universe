export function choiceOptions(mode: "yesno" | "custom", custom: string[]) {
  return mode === "yesno" ? ["Yes", "No"] : custom.map((s) => s.trim()).filter(Boolean);
}
export function validOptions(options: string[]) {
  return options.length >= 2 && new Set(options.map((s) => s.toLowerCase())).size === options.length;
}
