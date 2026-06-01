import { describe, expect, it } from "vitest";
import { plugin } from "../src/index";

describe("deepkit plugin", () => {
  it("plugin is a function", () => {
    expect(typeof plugin).toBe("function");
  });

  it("plugin() returns an object", () => {
    const result = plugin();
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
  });

  it("plugin() returns an array of plugin objects", () => {
    const result = plugin();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("plugin() result contains a deepkit plugin entry", () => {
    const result = plugin();
    const deepkitPlugin = result.find(
      (p: any) => typeof p === "object" && p !== null && p.name === "deepkit"
    );
    expect(deepkitPlugin).toBeDefined();
  });

  it("plugin() accepts an empty options object", () => {
    expect(() => plugin({})).not.toThrow();
  });

  it("plugin() returns the same name for all calls", () => {
    const r1 = plugin();
    const r2 = plugin({});
    expect(r1.name).toBe(r2.name);
  });
});
