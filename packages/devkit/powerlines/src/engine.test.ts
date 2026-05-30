import { describe, expect, it } from "vitest";
import { createPowerlines } from "./engine";

describe("createPowerlines", () => {
  it("is a function", () => {
    expect(typeof createPowerlines).toBe("function");
  });

  it("returns a Promise", () => {
    // We only verify the return type is a Promise; we don't actually execute the engine
    const result = createPowerlines({ cwd: process.cwd() });
    expect(result).toBeInstanceOf(Promise);
    // Ensure we don't let the promise settle unhandled
    result.catch(() => {});
  });
});
