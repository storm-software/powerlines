import { describe, expect, it } from "vitest";
import * as moduleExports from "./features-builtin";

describe("plugins/plugin-open-feature/src/components/features-builtin.tsx", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
