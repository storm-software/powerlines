import { describe, expect, it } from "vitest";
import { CACHE_HASH_LENGTH, ROOT_HASH_LENGTH } from "./meta";

describe("hash length constants", () => {
  it("ROOT_HASH_LENGTH is a positive number", () => {
    expect(typeof ROOT_HASH_LENGTH).toBe("number");
    expect(ROOT_HASH_LENGTH).toBeGreaterThan(0);
  });

  it("CACHE_HASH_LENGTH is a positive number", () => {
    expect(typeof CACHE_HASH_LENGTH).toBe("number");
    expect(CACHE_HASH_LENGTH).toBeGreaterThan(0);
  });

  it("CACHE_HASH_LENGTH is greater than ROOT_HASH_LENGTH", () => {
    expect(CACHE_HASH_LENGTH).toBeGreaterThan(ROOT_HASH_LENGTH);
  });

  it("ROOT_HASH_LENGTH equals 45", () => {
    expect(ROOT_HASH_LENGTH).toBe(45);
  });

  it("CACHE_HASH_LENGTH equals 62", () => {
    expect(CACHE_HASH_LENGTH).toBe(62);
  });
});
