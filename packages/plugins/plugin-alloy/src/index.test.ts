import { describe, expect, it } from "vitest";
import { plugin } from "./index";

describe("alloy plugin", () => {
  it("plugin is a function", () => {
    expect(typeof plugin).toBe("function");
  });

  it("plugin() returns an array of plugin objects", () => {
    const result = plugin();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("plugin() result contains an alloy plugin entry", () => {
    const result = plugin();
    const alloyPlugin = result.find(
      (p: any) => typeof p === "object" && p !== null && p.name === "alloy"
    );
    expect(alloyPlugin).toBeDefined();
  });

  it("plugin() accepts an empty options object", () => {
    expect(() => plugin({})).not.toThrow();
  });
});
