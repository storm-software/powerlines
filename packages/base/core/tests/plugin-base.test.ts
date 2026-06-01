import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/plugin-base";

describe("base/core/src/plugin-base.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  
});
