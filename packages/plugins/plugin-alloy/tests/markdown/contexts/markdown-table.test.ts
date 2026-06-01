import { describe, expect, it } from "vitest";
import * as moduleExports from "../../../src/markdown/contexts/markdown-table";

describe("plugins/plugin-alloy/src/markdown/contexts/markdown-table.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
