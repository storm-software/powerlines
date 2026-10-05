import { code } from "@alloy-js/core";
import { jsx } from "@alloy-js/core/jsx-runtime";
import type { JsonSchemaObject } from "@power-plant/schema";
import { render } from "@powerlines/plugin-alloy/render";
import { EnvBuiltin } from "@powerlines/plugin-env/components/env-builtin";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { EnvPluginContext } from "../src/types/plugin";

const runtimeKeys = [
  "PATH",
  "XDG_RUNTIME_DIR",
  "DEVENV_RUNTIME",
  "npm_execpath"
] as const;

function createContext(schema: JsonSchemaObject) {
  let generated = "";
  const context = {
    builtinsPath: "/workspace/.powerlines/builtins",
    entryPath: "/workspace/.powerlines/entry",
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    emitBuiltinSync: (contents: string) => {
      generated = contents;
    },
    config: {
      cwd: "/workspace",
      root: ".",
      name: "env-runtime-test",
      mode: "production",
      organization: "powerlines",
      platform: "node",
      framework: {
        name: "powerlines"
      },
      logLevel: {
        general: "info"
      },
      environment: {
        name: "production",
        runtime: "nodejs"
      },
      env: {
        prefix: ["POWERLINES"]
      }
    },
    env: {
      config: {
        active: [],
        hash: "env-schema",
        variant: "json-schema",
        schema
      }
    },
    meta: {
      buildId: "build-id",
      checksum: "checksum",
      releaseId: "release-id",
      timestamp: 0
    },
    packageJson: {
      version: "1.0.0"
    },
    tsconfig: {
      tsconfigFilePath: new URL("../tsconfig.json", import.meta.url).pathname
    }
  } as unknown as EnvPluginContext;

  return {
    context,
    getGenerated: () => generated
  };
}

describe("EnvBuiltin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps runtime fields out of generated defaults and reads runtime values", async () => {
    for (const key of runtimeKeys) {
      vi.stubEnv(key, `build-${key}`);
    }
    vi.stubEnv("BUILD_DEFAULT", "build-default");

    const schema: JsonSchemaObject = {
      name: "Env",
      type: "object",
      properties: {
        PATH: { type: "string", runtime: true },
        XDG_RUNTIME_DIR: { type: "string", runtime: true },
        DEVENV_RUNTIME: { type: "string", runtime: true },
        npm_execpath: { type: "string", runtime: true },
        BUILD_DEFAULT: { type: "string" }
      }
    };

    const { context, getGenerated } = createContext(schema);
    await render(
      context,
      jsx(EnvBuiltin, { defaultConfig: code`process.env` })
    );
    const generated = getGenerated();

    for (const key of runtimeKeys) {
      expect(generated).not.toContain(JSON.stringify(`build-${key}`));
      vi.stubEnv(key, `runtime-${key}`);
    }

    const compiled = transpileModule(generated, {
      compilerOptions: {
        module: ModuleKind.ESNext,
        target: ScriptTarget.ES2022
      }
    }).outputText;
    const generatedModule = await import(
      /* @vite-ignore */
      `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
    );

    for (const key of runtimeKeys) {
      expect(Object.hasOwn(generatedModule.initialEnv, key)).toBe(false);
      expect(generatedModule.env[key]).toBe(`runtime-${key}`);
    }
    expect(generatedModule.createEnv({}).BUILD_DEFAULT).toBe("build-default");
  });
});
