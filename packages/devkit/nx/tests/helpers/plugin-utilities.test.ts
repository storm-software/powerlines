import { describe, expect, it } from "vitest";
import { CONFIG_INPUTS } from "../../src/helpers/constants";
import { getNxPluginInputs, getNxTargetInputs } from "../../src/helpers/plugin-utilities";

describe("getNxTargetInputs", () => {
  it("returns an array of strings", () => {
    const result = getNxTargetInputs("vite");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("replaces {framework} placeholder with the given framework name", () => {
    const result = getNxTargetInputs("vite");
    for (const input of result) {
      expect(input).not.toContain("{framework}");
      expect(input).toContain("vite");
    }
  });

  it("returns the same number of items as CONFIG_INPUTS", () => {
    const result = getNxTargetInputs("webpack");
    expect(result.length).toBe(CONFIG_INPUTS.length);
  });

  it("works with different framework names", () => {
    const vitResult = getNxTargetInputs("vite");
    const webpackResult = getNxTargetInputs("webpack");
    expect(vitResult[0]).not.toBe(webpackResult[0]);
    expect(vitResult[0]).toContain("vite");
    expect(webpackResult[0]).toContain("webpack");
  });
});

describe("getNxPluginInputs", () => {
  it("returns a string", () => {
    const result = getNxPluginInputs("vite");
    expect(typeof result).toBe("string");
  });

  it("contains the framework name", () => {
    const result = getNxPluginInputs("rollup");
    expect(result).toContain("rollup");
  });

  it("uses glob pattern format starting with **/", () => {
    const result = getNxPluginInputs("vite");
    expect(result).toMatch(/^\*\*\/\{/);
  });
});
