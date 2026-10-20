import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLocalStore } from "@/lib/storage";

describe("Private browser records", () => {
  beforeEach(() => localStorage.clear());
  it("preserves existing entries and reads saved changes after remount", async () => {
    const existing = [{ id: "old", decision: "Walk", at: "2026-10-20T09:00", feeling: "calm", action: "Outside", outcome: "Better" }];
    localStorage.setItem("lunora.journal", JSON.stringify(existing));
    const first = renderHook(() => useLocalStore("lunora.journal", existing));
    await waitFor(() => expect(first.result.current[2]).toBe(true));
    expect(first.result.current[0]).toEqual(existing);
    act(() => first.result.current[1]([...existing, { ...existing[0], id: "new", decision: "Read" }]));
    first.unmount();
    const next = renderHook(() => useLocalStore<typeof existing>("lunora.journal", []));
    await waitFor(() => expect(next.result.current[0]).toHaveLength(2));
    expect(next.result.current[0][0]).toEqual(existing[0]);
    expect(next.result.current[0][1]?.decision).toBe("Read");
  });
});