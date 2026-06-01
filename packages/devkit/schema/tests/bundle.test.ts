import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@powerlines/core/lib/unplugin", () => ({
  createUnpluginResolver: vi.fn(() => ({}))
}));

vi.mock("@powerlines/unplugin/esbuild", () => ({
  resolveOptions: vi.fn(() => ({}))
}));

vi.mock("unplugin", () => ({
  createEsbuildPlugin: vi.fn(() => () => ({ name: "test-plugin" }))
}));

vi.mock("esbuild", () => ({
  build: vi.fn()
}));

import { build } from "esbuild";
import { bundle } from "../src/bundle";

describe("devkit/schema/src/bundle.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when the input file cannot be resolved", async () => {
    const context = {
      fs: {
        resolve: vi.fn().mockResolvedValue(undefined),
        existsSync: vi.fn().mockReturnValue(false)
      },
      warn: vi.fn()
    } as any;

    await expect(bundle(context, "./missing.ts")).rejects.toThrow(
      'Module not found: "./missing.ts"'
    );
  });

  it("returns the first output file from esbuild", async () => {
    const output = {
      path: "/virtual/out.js",
      text: "export default 1;",
      contents: new Uint8Array()
    };

    vi.mocked(build).mockResolvedValue({
      errors: [],
      warnings: [],
      outputFiles: [output]
    } as any);

    const context = {
      fs: {
        resolve: vi.fn().mockResolvedValue("/virtual/input.ts"),
        existsSync: vi.fn().mockReturnValue(true)
      },
      warn: vi.fn()
    } as any;

    await expect(bundle(context, "./input.ts")).resolves.toEqual(output);
    expect(build).toHaveBeenCalledTimes(1);
  });
});
