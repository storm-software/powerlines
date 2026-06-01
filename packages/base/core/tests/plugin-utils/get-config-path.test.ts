import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/plugin-utils/get-config-path";

describe("base/core/src/plugin-utils/get-config-path.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
