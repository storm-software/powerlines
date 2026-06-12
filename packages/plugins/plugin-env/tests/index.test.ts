import { describe, expect, it } from "vitest";
import { plugin } from "../src/index";

describe("env plugin", () => {
  it("plugin is a function", () => {
    expect(typeof plugin).toBe("function");
  });

  it("plugin() returns an object", () => {
    const result = plugin();
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
  });

  it("plugin() returns an object with a name property", () => {
    const result = plugin();
    result.forEach((item) => {
      expect(item).toHaveProperty("name");
      expect(typeof item.name).toBe("string");
    });
  });

  it("plugin() accepts an empty options object", () => {
    expect(() => plugin({})).not.toThrow();
  });

  it("plugin() returns the same name for all calls", () => {
    const r1 = plugin();
    const r2 = plugin({});
    r1.forEach((item, index) => {
      expect(item.name).toBe(r2[index].name);
    });
  });
});
