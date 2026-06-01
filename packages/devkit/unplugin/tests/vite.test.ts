import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS } from "../src/vite";

describe("vite DEFAULT_OPTIONS", () => {
  it("is an object", () => {
    expect(typeof DEFAULT_OPTIONS).toBe("object");
    expect(DEFAULT_OPTIONS).not.toBeNull();
  });

  it("has logLevel set to silent", () => {
    expect(DEFAULT_OPTIONS.logLevel).toBe("silent");
  });

  it("has resolve.extensions array", () => {
    expect(Array.isArray(DEFAULT_OPTIONS.resolve?.extensions)).toBe(true);
  });
});
