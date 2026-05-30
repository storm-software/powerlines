import { describe, expect, it } from "vitest";
import * as moduleExports from "./combine-plugins";

describe("base/core/src/plugin-utils/combine-plugins.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
