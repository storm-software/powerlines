import { describe, expect, it } from "vitest";
import { getPluginName, includesPlugin, includesPreset } from "./filters";

describe("getPluginName", () => {
  it("returns undefined for undefined input", () => {
    expect(getPluginName(undefined)).toBeUndefined();
  });

  it("returns the string when given a string", () => {
    expect(getPluginName("my-plugin")).toBe("my-plugin");
  });

  it("returns the plugin name from a named function", () => {
    function myPlugin() {}
    expect(getPluginName(myPlugin)).toBe("myPlugin");
  });

  it("returns the name property from an object", () => {
    const plugin = { name: "test-plugin", apply: () => {} };
    expect(getPluginName(plugin)).toBe("test-plugin");
  });

  it("extracts name from the first element of an array", () => {
    expect(getPluginName(["my-plugin", {}])).toBe("my-plugin");
  });
});

describe("includesPlugin", () => {
  it("returns false when plugin name is not found in list", () => {
    const plugins = [["other-plugin", {}]] as any[];
    expect(includesPlugin(plugins, ["my-plugin", {}] as any)).toBe(false);
  });

  it("returns false when plugin has no name", () => {
    const plugins = [[{}]] as any[];
    expect(includesPlugin(plugins, [{}] as any)).toBe(false);
  });
});

describe("includesPreset", () => {
  it("is a function", () => {
    expect(typeof includesPreset).toBe("function");
  });
});
