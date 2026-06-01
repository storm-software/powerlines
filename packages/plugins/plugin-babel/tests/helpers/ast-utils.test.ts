import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/helpers/ast-utils";

describe("plugins/plugin-babel/src/helpers/ast-utils.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
