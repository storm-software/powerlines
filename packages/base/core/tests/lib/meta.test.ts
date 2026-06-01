import { describe, expect, it } from "vitest";
import { ROOT_HASH_LENGTH } from "../../src/constants";
import { getPrefixedRootHash } from "../../src/lib/meta";

describe("getPrefixedRootHash", () => {
  it("returns a string", () => {
    const result = getPrefixedRootHash("my-project", "abc123def456");
    expect(typeof result).toBe("string");
  });

  it("combines name and rootHash with underscore separator", () => {
    const result = getPrefixedRootHash("project", "hash123");
    expect(result).toBe("project_hash123");
  });

  it("kebab-cases the project name", () => {
    const result = getPrefixedRootHash("myProject", "hash123");
    expect(result).toContain("_hash123");
    expect(result).not.toContain("myProject");
  });

  it("truncates the result when it exceeds ROOT_HASH_LENGTH characters", () => {
    const longName = "a".repeat(30);
    const longHash = "b".repeat(30);
    const result = getPrefixedRootHash(longName, longHash);
    expect(result.length).toBeLessThanOrEqual(ROOT_HASH_LENGTH);
  });

  it("does not truncate when result is within ROOT_HASH_LENGTH", () => {
    const result = getPrefixedRootHash("x", "y");
    expect(result).toBe("x_y");
  });
});
