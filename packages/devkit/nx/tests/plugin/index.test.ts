import { describe, expect, it } from "vitest";
import { createNodesV2 } from "../../src/plugin/index";

describe("createNodesV2", () => {
  it("is defined", () => {
    expect(createNodesV2).toBeDefined();
  });

  it("is a tuple/array", () => {
    expect(Array.isArray(createNodesV2)).toBe(true);
  });

  it("has a glob pattern as first element", () => {
    const [globPattern] = createNodesV2 as [string, ...any[]];
    expect(typeof globPattern).toBe("string");
    expect(globPattern.length).toBeGreaterThan(0);
  });

  it("has a function as the second element", () => {
    const [, fn] = createNodesV2 as [string, any];
    expect(typeof fn).toBe("function");
  });
});
