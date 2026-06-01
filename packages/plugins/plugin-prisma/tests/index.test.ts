import { describe, expect, it } from "vitest";
import { plugin } from "../src/index";
import type { Plugin } from "powerlines";

describe("prisma plugin", () => {
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
      result.forEach((pluginInstance: Plugin<any>) => {
        expect(pluginInstance).toHaveProperty("name");
        expect(typeof pluginInstance.name).toBe("string");
      });
    });

    it("plugin() accepts an empty options object", () => {
      expect(() => plugin({})).not.toThrow();
    });

    it("plugin() returns the same name for all calls", () => {
      const r1 = plugin();
      const r2 = plugin({});
      r1.forEach((pluginInstance: Plugin<any>, index: number) => {
        expect(pluginInstance).toHaveProperty("name");
        expect(typeof pluginInstance.name).toBe("string");
        expect(pluginInstance.name).toBe(r2[index].name);
      });
    });
});
