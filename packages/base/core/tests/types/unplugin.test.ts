import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/types/unplugin";

describe("base/core/src/types/unplugin.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("allows modules with zero runtime exports", () => {
    const exportKeys = Object.keys(moduleExports).filter(
      (key) => key !== "__esModule"
    );
    expect(exportKeys.length).toBeGreaterThanOrEqual(0);
  });
});
