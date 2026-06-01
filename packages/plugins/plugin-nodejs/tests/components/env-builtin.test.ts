import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/components/env-builtin";

describe("plugins/plugin-nodejs/src/components/env-builtin.tsx", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
