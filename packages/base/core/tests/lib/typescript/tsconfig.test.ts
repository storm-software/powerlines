import { describe, expect, it } from "vitest";
import * as moduleExports from "../../../src/lib/typescript/tsconfig";

describe("base/core/src/lib/typescript/tsconfig.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
