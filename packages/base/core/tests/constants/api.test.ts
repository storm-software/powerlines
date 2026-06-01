import { describe, expect, it } from "vitest";
import { BASE_EXECUTION_API_METHODS, EXECUTION_API_METHODS } from "../../src/constants/api";

describe("BASE_EXECUTION_API_METHODS", () => {
  it("is an array", () => {
    expect(Array.isArray(BASE_EXECUTION_API_METHODS)).toBe(true);
  });

  it("includes all core build lifecycle methods", () => {
    expect(BASE_EXECUTION_API_METHODS).toContain("create");
    expect(BASE_EXECUTION_API_METHODS).toContain("clean");
    expect(BASE_EXECUTION_API_METHODS).toContain("prepare");
    expect(BASE_EXECUTION_API_METHODS).toContain("lint");
    expect(BASE_EXECUTION_API_METHODS).toContain("test");
    expect(BASE_EXECUTION_API_METHODS).toContain("build");
    expect(BASE_EXECUTION_API_METHODS).toContain("docs");
    expect(BASE_EXECUTION_API_METHODS).toContain("deploy");
  });
});

describe("EXECUTION_API_METHODS", () => {
  it("is an array", () => {
    expect(Array.isArray(EXECUTION_API_METHODS)).toBe(true);
  });

  it("includes all base methods plus types", () => {
    expect(EXECUTION_API_METHODS).toContain("types");
    expect(EXECUTION_API_METHODS).toContain("build");
    expect(EXECUTION_API_METHODS).toContain("lint");
  });

  it("has one more entry than BASE_EXECUTION_API_METHODS", () => {
    expect(EXECUTION_API_METHODS.length).toBe(
      BASE_EXECUTION_API_METHODS.length + 1
    );
  });
});
