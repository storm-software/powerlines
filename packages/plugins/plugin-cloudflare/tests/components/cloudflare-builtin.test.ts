import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/components/cloudflare-builtin";

describe("plugins/plugin-cloudflare/src/components/cloudflare-builtin.tsx", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
