import { describe, expect, it } from "vitest";
import * as moduleExports from "./builtin-file";

describe("plugins/plugin-alloy/src/typescript/components/builtin-file.tsx", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
