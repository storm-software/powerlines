import { describe, expect, it } from "vitest";
import * as moduleExports from "../../../src/typescript/helpers/get-call-signature-props";

describe("plugins/plugin-alloy/src/typescript/helpers/get-call-signature-props.ts", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("has at least one runtime export", () => {
    expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
  });
});
