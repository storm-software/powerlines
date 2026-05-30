import { describe, expect, it } from "vitest";
import { HOOKS_LIST_ORDERS } from "./hooks";

describe("HOOKS_LIST_ORDERS", () => {
  it("is an array", () => {
    expect(Array.isArray(HOOKS_LIST_ORDERS)).toBe(true);
  });

  it("contains pre-ordered and post-ordered variants", () => {
    expect(HOOKS_LIST_ORDERS).toContain("preOrdered");
    expect(HOOKS_LIST_ORDERS).toContain("preEnforced");
    expect(HOOKS_LIST_ORDERS).toContain("normal");
    expect(HOOKS_LIST_ORDERS).toContain("postEnforced");
    expect(HOOKS_LIST_ORDERS).toContain("postOrdered");
  });

  it("has exactly 5 entries", () => {
    expect(HOOKS_LIST_ORDERS).toHaveLength(5);
  });
});
