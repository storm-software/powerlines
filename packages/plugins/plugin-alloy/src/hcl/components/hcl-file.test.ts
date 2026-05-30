import { describe, expect, it } from "vitest";
import * as moduleExports from "./hcl-file";

describe("plugins/plugin-alloy/src/hcl/components/hcl-file.tsx", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
