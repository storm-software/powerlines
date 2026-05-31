import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./bundle", () => ({
  bundle: vi.fn()
}));

vi.mock("@powerlines/deepkit/vendor/type", () => ({
  reflect: vi.fn((value: unknown) => ({ reflected: value }))
}));

vi.mock("@powerlines/deepkit/esbuild-plugin", () => ({
  esbuildPlugin: vi.fn(() => ({ name: "reflection-plugin" }))
}));

import { bundle } from "./bundle";
import { resolve, resolveModule, resolveReflection } from "./resolve";

describe("devkit/schema/src/resolve.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolve parses JSON, YAML, and TOML files", async () => {
    const context = {
      fs: {
        read: vi
          .fn()
          .mockResolvedValueOnce('{"name":"json"}')
          .mockResolvedValueOnce("name: yaml")
          .mockResolvedValueOnce('name = "toml"')
      }
    } as any;

    await expect(resolve(context, "./schema.json")).resolves.toEqual({
      name: "json"
    });
    await expect(resolve(context, "./schema.yaml")).resolves.toEqual({
      name: "yaml"
    });
    await expect(resolve(context, "./schema.toml")).resolves.toEqual({
      name: "toml"
    });
  });

  it("resolveModule evaluates bundled module output", async () => {
    vi.mocked(bundle).mockResolvedValue({
      path: "/virtual/out.js",
      text: "export default 1;"
    } as any);

    const context = {
      config: {
        framework: { name: "powerlines" },
        logLevel: { general: "info" }
      },
      resolver: {
        evalModule: vi.fn().mockResolvedValue({ default: 42 })
      }
    } as any;

    await expect(resolveModule(context, "./module.ts")).resolves.toEqual({
      default: 42
    });
  });

  it("resolve returns the requested export and resolveReflection wraps it", async () => {
    vi.mocked(bundle).mockResolvedValue({
      path: "/virtual/out.js",
      text: "export const schema = { type: 'string' };"
    } as any);

    const context = {
      config: {
        framework: { name: "powerlines" },
        logLevel: { general: "info" }
      },
      fs: {
        read: vi.fn()
      },
      resolver: {
        evalModule: vi.fn().mockResolvedValue({ schema: { type: "string" } })
      }
    } as any;

    await expect(
      resolve(context, { file: "./module.ts", export: "schema" })
    ).resolves.toEqual({ type: "string" });

    await expect(
      resolveReflection(context, { file: "./module.ts", export: "schema" } as any)
    ).resolves.toEqual({ reflected: { type: "string" } });
  });
});
