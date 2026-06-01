import { describe, expect, it } from "vitest";
import { withExecutor } from "../../src/base/base-executor";

describe("withExecutor", () => {
  it("is a function", () => {
    expect(typeof withExecutor).toBe("function");
  });

  it("returns a function when called with options", () => {
    const result = withExecutor("build", () => undefined, { importPath: "powerlines/api" });
    expect(typeof result).toBe("function");
  });

  it("accepts an empty options object", () => {
    expect(() => withExecutor("build", () => undefined, {})).not.toThrow();
  });
});
