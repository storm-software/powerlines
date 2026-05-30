import { describe, expect, it } from "vitest";
import * as moduleExports from "./single-line-comment";

describe("plugins/plugin-alloy/src/core/components/single-line-comment.tsx", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
