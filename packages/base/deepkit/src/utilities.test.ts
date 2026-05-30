import { describe, expect, it } from "vitest";
import { stringifyStringValue, stringifyValue } from "./utilities";

describe("stringifyStringValue", () => {
  it("is a function", () => {
    expect(typeof stringifyStringValue).toBe("function");
  });

  it("wraps a string in double quotes", () => {
    const result = stringifyStringValue("hello");
    expect(result).toBe('"hello"');
  });

  it("returns undefined as the string 'undefined' in quotes", () => {
    const result = stringifyStringValue(undefined);
    expect(result).toBe('"undefined"');
  });

  it("escapes inner double quotes", () => {
    const result = stringifyStringValue('say "hello"');
    expect(result).toBe('"say \\"hello\\""');
  });

  it("handles numbers by converting to string", () => {
    const result = stringifyStringValue(42);
    expect(result).toBe('"42"');
  });
});

describe("stringifyValue", () => {
  it("is a function", () => {
    expect(typeof stringifyValue).toBe("function");
  });

  it("returns 'undefined' for undefined value", () => {
    const result = stringifyValue({ kind: 5 } as any, undefined);
    expect(result).toBe("undefined");
  });

  it("returns 'null' for null value", () => {
    const result = stringifyValue({ kind: 5 } as any, null);
    expect(result).toBe("null");
  });
});
