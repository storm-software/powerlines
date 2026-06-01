import { describe, expect, it } from "vitest";
import { isApiExecutionOptions, isEngineExecutionOptions } from "../../src/helpers/type-checks";

describe("isEngineExecutionOptions", () => {
  it("returns true when channel property is present", () => {
    const options = { channel: "some-channel" } as any;
    expect(isEngineExecutionOptions(options)).toBe(true);
  });

  it("returns false when channel property is absent", () => {
    const options = { cwd: "/some/path" } as any;
    expect(isEngineExecutionOptions(options)).toBe(false);
  });

  it("returns false for an empty object", () => {
    expect(isEngineExecutionOptions({} as any)).toBe(false);
  });
});

describe("isApiExecutionOptions", () => {
  it("returns true when channel property is absent", () => {
    const options = { cwd: "/some/path" } as any;
    expect(isApiExecutionOptions(options)).toBe(true);
  });

  it("returns false when channel property is present", () => {
    const options = { channel: "some-channel" } as any;
    expect(isApiExecutionOptions(options)).toBe(false);
  });

  it("returns true for an empty object", () => {
    expect(isApiExecutionOptions({} as any)).toBe(true);
  });
});
