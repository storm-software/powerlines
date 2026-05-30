import { describe, expect, it } from "vitest";
import { refkey } from "./refkey";

describe("refkey", () => {
  it("is a function", () => {
    expect(typeof refkey).toBe("function");
  });

  it("returns a value when called with no arguments", () => {
    const key = refkey();
    expect(key).toBeDefined();
  });

  it("returns the same refkey for the same arguments", () => {
    const key1 = refkey("test", 123);
    const key2 = refkey("test", 123);
    expect(key1).toBe(key2);
  });

  it("returns different refkeys for different arguments", () => {
    const key1 = refkey("a");
    const key2 = refkey("b");
    expect(key1).not.toBe(key2);
  });

  it("returns unique refkeys when called with no arguments", () => {
    const key1 = refkey();
    const key2 = refkey();
    expect(key1).not.toBe(key2);
  });
});
