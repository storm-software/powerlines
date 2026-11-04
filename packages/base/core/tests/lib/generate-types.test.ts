import defu from "defu";
import { Project } from "ts-morph";
import { describe, expect, it, vi } from "vitest";
import type { Context } from "../../src/types/context";
import { emitBuiltinTypes } from "../../src/lib/generate-types";

vi.mock("../../src/lib/utilities/format", () => ({
  format: vi.fn(async (_context, _path, code: string) => code)
}));

// Mirror `createProgram`'s precedence (override over the project tsconfig) with a project `rootDir` of "." below the workspace cwd (the in-memory host cwd is "/")
vi.mock("../../src/lib/typescript/ts-morph", () => ({
  createProgram: (_context: unknown, override: Record<string, any>) => {
    const project = new Project(
      defu(override, {
        useInMemoryFileSystem: true,
        compilerOptions: { rootDir: "/app" }
      })
    );
    project
      .getFileSystem()
      .writeFileSync(
        "/app/.powerlines/builtins/console.ts",
        "export function write(text: string): void {}\n"
      );

    return project;
  }
}));

describe("emitBuiltinTypes", () => {
  it("declares builtin modules when the project tsconfig sets rootDir", async () => {
    const context = {
      builtins: ["console"],
      builtinsPath: "/app/.powerlines/builtins",
      config: { cwd: "/", framework: { name: "powerlines" } },
      debug: vi.fn(),
      warn: vi.fn()
    } as unknown as Context;

    const { code } = await emitBuiltinTypes(context, [
      "/app/.powerlines/builtins/console.ts"
    ]);

    expect(code).toContain('declare module "powerlines:console"');
    expect(code).toContain("write(text: string): void");
  });
});
