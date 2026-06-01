import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS } from "../src/esbuild";

describe("esbuild DEFAULT_OPTIONS", () => {
  it("is an object", () => {
    expect(typeof DEFAULT_OPTIONS).toBe("object");
    expect(DEFAULT_OPTIONS).not.toBeNull();
  });

  it("has target set to esnext", () => {
    expect(DEFAULT_OPTIONS.target).toBe("esnext");
  });

  it("has format set to esm", () => {
    expect(DEFAULT_OPTIONS.format).toBe("esm");
  });

  it("has bundle set to true", () => {
    expect(DEFAULT_OPTIONS.bundle).toBe(true);
  });

  it("has logLevel set to silent", () => {
    expect(DEFAULT_OPTIONS.logLevel).toBe("silent");
  });
});
