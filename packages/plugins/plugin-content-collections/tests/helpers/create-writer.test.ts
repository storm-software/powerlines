import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/helpers/create-writer";

describe("plugins/plugin-content-collections/src/helpers/create-writer.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
