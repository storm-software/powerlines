import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/types/api";

describe("base/engine/src/types/api.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
