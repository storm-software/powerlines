import { describe, expect, it } from "vitest";
import * as moduleExports from "./create-operation-id";

describe("plugins/plugin-hey-api/src/helpers/create-operation-id.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
