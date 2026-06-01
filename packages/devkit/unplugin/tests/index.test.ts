import { describe, expect, it } from "vitest";
import plugins, { plugins as namedPlugins } from "../src/index";

describe("unplugin index", () => {
  it("exports plugins as default", () => {
    expect(typeof plugins).toBe("object");
    expect(plugins).not.toBeNull();
  });

  it("exports named plugins object", () => {
    expect(typeof namedPlugins).toBe("object");
    expect(namedPlugins).not.toBeNull();
  });

  it("plugins includes common bundler adapters", () => {
    expect(typeof plugins.vite).toBeDefined();
    expect(typeof plugins.esbuild).toBeDefined();
    expect(typeof plugins.rollup).toBeDefined();
    expect(typeof plugins.rolldown).toBeDefined();
    expect(typeof plugins.webpack).toBeFalsy();
  });

  it("plugins includes tsup and tsdown adapters", () => {
    expect(plugins.tsup).toBeDefined();
    expect(plugins.tsdown).toBeDefined();
  });
});
