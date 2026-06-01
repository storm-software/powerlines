import { describe, expect, it } from "vitest";
import { DEFAULT_EXTENSIONS } from "../../src/constants/extensions";

describe("DEFAULT_EXTENSIONS", () => {
  it("is an array", () => {
    expect(Array.isArray(DEFAULT_EXTENSIONS)).toBe(true);
  });

  it("contains common TypeScript and JavaScript extensions", () => {
    expect(DEFAULT_EXTENSIONS).toContain("ts");
    expect(DEFAULT_EXTENSIONS).toContain("js");
    expect(DEFAULT_EXTENSIONS).toContain("mjs");
    expect(DEFAULT_EXTENSIONS).toContain("cjs");
    expect(DEFAULT_EXTENSIONS).toContain("tsx");
    expect(DEFAULT_EXTENSIONS).toContain("jsx");
  });

  it("contains config and markup extensions", () => {
    expect(DEFAULT_EXTENSIONS).toContain("json");
    expect(DEFAULT_EXTENSIONS).toContain("md");
    expect(DEFAULT_EXTENSIONS).toContain("mdx");
  });

  it("has more than 5 extensions", () => {
    expect(DEFAULT_EXTENSIONS.length).toBeGreaterThan(5);
  });
});
