import { describe, expect, it } from "vitest";
import { plugin } from "../src/index";

describe("napi-rs plugin", () => {
  it("plugin is a function", () => {
    expect(typeof plugin).toBe("function");
  });

  it("plugin() returns an array", () => {
    const result = plugin();
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("plugin() returns plugin objects with a name property", () => {
    const result = plugin();
    expect(result[0]).toHaveProperty("name");
    expect(typeof result[0].name).toBe("string");
  });

  it("plugin() accepts an empty options object", () => {
    expect(() => plugin({})).not.toThrow();
  });

  it("plugin() returns the same name for all calls", () => {
    const r1 = plugin();
    const r2 = plugin({});
    expect(r1[0].name).toBe(r2[0].name);
  });
});
