import { describe, expect, it } from "vitest";
import { SUPPORTED_COMMANDS } from "./commands";

describe("SUPPORTED_COMMANDS", () => {
  it("is an array", () => {
    expect(Array.isArray(SUPPORTED_COMMANDS)).toBe(true);
  });

  it("includes all execution api methods", () => {
    expect(SUPPORTED_COMMANDS).toContain("build");
    expect(SUPPORTED_COMMANDS).toContain("lint");
    expect(SUPPORTED_COMMANDS).toContain("test");
    expect(SUPPORTED_COMMANDS).toContain("deploy");
    expect(SUPPORTED_COMMANDS).toContain("types");
  });

  it("includes the finalize command", () => {
    expect(SUPPORTED_COMMANDS).toContain("finalize");
  });
});
