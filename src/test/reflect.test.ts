import { describe, it, expect } from "vitest";
import { buildReflectionMessages, validReflectionInput, REFLECT_SYSTEM } from "@/lib/reflect";

describe("reflection companion input", () => {
  it("requires two non-empty options", () => {
    expect(validReflectionInput("", "B")).toBe(false);
    expect(validReflectionInput("A", "")).toBe(false);
    expect(validReflectionInput("  ", "  ")).toBe(false);
  });

  it("rejects identical options", () => {
    expect(validReflectionInput("Same", "same")).toBe(false);
  });

  it("accepts two different options", () => {
    expect(validReflectionInput("Stay", "Go")).toBe(true);
  });
});

describe("reflection prompt", () => {
  it("includes both options and what matters, and forbids choosing", () => {
    const msgs = buildReflectionMessages("Stay", "Go", "family time");
    expect(msgs).toHaveLength(2);
    expect(msgs[0]?.role).toBe("system");
    expect(msgs[0]?.content).toBe(REFLECT_SYSTEM);
    expect(msgs[0]?.content).toMatch(/Never recommend/);
    const user = msgs[1]?.content ?? "";
    expect(user).toContain("Option A: Stay");
    expect(user).toContain("Option B: Go");
    expect(user).toContain("family time");
    expect(user).toContain("Do not choose for me");
  });

  it("omits the matters line when left empty", () => {
    const msgs = buildReflectionMessages("A", "B", "   ");
    expect(msgs[1]?.content).not.toContain("What matters most");
  });
});
