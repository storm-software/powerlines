import { describe, expect, it } from "vitest";
import { plugin } from "../src/index";

describe("style-dictionary plugin", () => {
  it("plugin is a function", () => {
    expect(typeof plugin).toBe("function");
  });

  it("plugin() returns plugin instances", () => {
    const result = plugin();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("plugin() includes power-plant and style-dictionary plugins", () => {
    const result = plugin();
    expect(result.map(pluginInstance => pluginInstance.name)).toEqual([
      "power-plant",
      "style-dictionary"
    ]);
  });

  it("plugin() accepts an empty options object", () => {
    expect(() => plugin({})).not.toThrow();
  });

  it("plugin() returns the same plugin names for all calls", () => {
    const r1 = plugin();
    const r2 = plugin({});
    expect(r1.map(pluginInstance => pluginInstance.name)).toEqual(
      r2.map(pluginInstance => pluginInstance.name)
    );
  });
});
