import { describe, expect, it } from "vitest";
import {
  BUILDER_VARIANTS,
  PLUGIN_HOOKS_FIELDS,
  PLUGIN_NON_HOOK_FIELDS,
  UNPLUGIN_BUILDER_VARIANTS
} from "../../src/constants/plugin";

describe("UNPLUGIN_BUILDER_VARIANTS", () => {
  it("is an array", () => {
    expect(Array.isArray(UNPLUGIN_BUILDER_VARIANTS)).toBe(true);
  });

  it("contains common bundler names", () => {
    expect(UNPLUGIN_BUILDER_VARIANTS).toContain("rollup");
    expect(UNPLUGIN_BUILDER_VARIANTS).toContain("webpack");
    expect(UNPLUGIN_BUILDER_VARIANTS).toContain("vite");
    expect(UNPLUGIN_BUILDER_VARIANTS).toContain("esbuild");
    expect(UNPLUGIN_BUILDER_VARIANTS).toContain("rolldown");
  });
});

describe("BUILDER_VARIANTS", () => {
  it("contains all unplugin variants plus extras", () => {
    for (const variant of UNPLUGIN_BUILDER_VARIANTS) {
      expect(BUILDER_VARIANTS).toContain(variant);
    }
    expect(BUILDER_VARIANTS).toContain("tsup");
    expect(BUILDER_VARIANTS).toContain("tsdown");
    expect(BUILDER_VARIANTS).toContain("unbuild");
  });

  it("is larger than UNPLUGIN_BUILDER_VARIANTS", () => {
    expect(BUILDER_VARIANTS.length).toBeGreaterThan(
      UNPLUGIN_BUILDER_VARIANTS.length
    );
  });
});

describe("PLUGIN_NON_HOOK_FIELDS", () => {
  it("is an array", () => {
    expect(Array.isArray(PLUGIN_NON_HOOK_FIELDS)).toBe(true);
  });

  it("contains expected plugin fields", () => {
    expect(PLUGIN_NON_HOOK_FIELDS).toContain("name");
    expect(PLUGIN_NON_HOOK_FIELDS).toContain("api");
    expect(PLUGIN_NON_HOOK_FIELDS).toContain("enforce");
  });
});

describe("PLUGIN_HOOKS_FIELDS", () => {
  it("is an array", () => {
    expect(Array.isArray(PLUGIN_HOOKS_FIELDS)).toBe(true);
  });

  it("contains common build lifecycle hooks", () => {
    expect(PLUGIN_HOOKS_FIELDS).toContain("build");
    expect(PLUGIN_HOOKS_FIELDS).toContain("buildStart");
    expect(PLUGIN_HOOKS_FIELDS).toContain("buildEnd");
    expect(PLUGIN_HOOKS_FIELDS).toContain("config");
    expect(PLUGIN_HOOKS_FIELDS).toContain("transform");
  });
});
