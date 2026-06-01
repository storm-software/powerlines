import { describe, expect, it } from "vitest";
import {
  STORAGE_PRESETS,
  __VFS_PATCH__,
  __VFS_REVERT__
} from "../../src/constants/fs";

describe("VFS constants", () => {
  it("__VFS_PATCH__ is the correct string", () => {
    expect(__VFS_PATCH__).toBe("__VFS_PATCH__");
  });

  it("__VFS_REVERT__ is the correct string", () => {
    expect(__VFS_REVERT__).toBe("__VFS_REVERT__");
  });
});

describe("STORAGE_PRESETS", () => {
  it("is an array", () => {
    expect(Array.isArray(STORAGE_PRESETS)).toBe(true);
  });

  it("contains fs and virtual presets", () => {
    expect(STORAGE_PRESETS).toContain("fs");
    expect(STORAGE_PRESETS).toContain("virtual");
  });

  it("has exactly 2 presets", () => {
    expect(STORAGE_PRESETS).toHaveLength(2);
  });
});
