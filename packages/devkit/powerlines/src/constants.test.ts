import { describe, expect, it } from "vitest";

describe("devkit/powerlines constants re-exports", () => {
  it("re-exports constants from @powerlines/core", async () => {
    // Dynamic import to verify the module loads without error
    const mod = await import("./constants");
    expect(typeof mod).toBe("object");
  });
});
