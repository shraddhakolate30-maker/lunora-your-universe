import { describe, expect, it, vi } from "vitest";
import { assignChits, choiceOptions, validOptions } from "@/lib/choices";
import { randomIndex } from "@/lib/storage";

describe("Everyday random choices", () => {
  it("offers exactly Yes and No in simple mode", () => {
    expect(choiceOptions("yesno", ["other"])).toEqual(["Yes", "No"]);
  });
  it("requires at least two actual options", () => {
    expect(validOptions(choiceOptions("custom", ["Tea", " "]))).toBe(false);
    expect(validOptions(choiceOptions("custom", ["Tea", "Coffee"]))).toBe(true);
  });
  it("rejects duplicate options regardless of case", () => {
    expect(validOptions(choiceOptions("custom", [" Tea ", "tea"]))).toBe(false);
  });
  it("selects only actual user options through random indices", () => {
    const options = choiceOptions("custom", [" Tea ", "Coffee", "Walk"]);
    for (const value of [0, 1, 2, 3, 100]) {
      const mock = vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
        if (array instanceof Uint32Array) array[0] = value;
        return array;
      });
      expect(options[randomIndex(options.length)]).toBe(options[value % 3]);
      mock.mockRestore();
    }
  });
  it("assigns secret chits fairly without changing the options", () => {
    expect(assignChits("Tea", "Coffee", () => 0)).toEqual(["Tea", "Coffee"]);
    expect(assignChits("Tea", "Coffee", () => 1)).toEqual(["Coffee", "Tea"]);
    for (const value of [0, 1, 2, 3, 100]) {
      const mock = vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
        if (array instanceof Uint32Array) array[0] = value;
        return array;
      });
      const chits = assignChits("Yes", "No", randomIndex);
      expect([...chits].sort()).toEqual(["No", "Yes"]);
      expect(chits[0]).toBe(value % 2 === 0 ? "Yes" : "No");
      mock.mockRestore();
    }
  });
});