import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/types";

describe("base/deepkit/src/types.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has no runtime exports for a type-only module", () => {
    expect(Object.keys(moduleExports).length).toBe(0);
  });
});
