import { describe, expect, it } from "vitest";
import { plugin } from "../src/index";

describe("graphql plugin", () => {
  it("plugin is a function", () => {
    expect(typeof plugin).toBe("function");
  });

  it("plugin() returns plugin instances", () => {
    const result = plugin();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("plugin() returns objects with name properties", () => {
    const result = plugin();
    for (const instance of result) {
      expect(instance).toHaveProperty("name");
      expect(typeof instance.name).toBe("string");
    }
  });

  it("plugin() accepts an empty options object", () => {
    expect(() => plugin({})).not.toThrow();
  });

  it("plugin() returns the same graphql name for all calls", () => {
    const r1 = plugin();
    const r2 = plugin({});
    const graphqlPlugin = (plugins: ReturnType<typeof plugin>) =>
      plugins.find(instance => instance.name === "graphql");

    expect(graphqlPlugin(r1)?.name).toBe(graphqlPlugin(r2)?.name);
  });
});
