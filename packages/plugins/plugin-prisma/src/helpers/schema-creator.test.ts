import { describe, expect, it } from "vitest";
import * as moduleExports from "./schema-creator";

describe("plugins/plugin-prisma/src/helpers/schema-creator.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
