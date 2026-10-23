---
title: Configure powerlines
description: Set input, output, resolve, and plugin options in a powerlines config file.
documentType: concept
---

# Configure powerlines

Powerlines reads a user config file and merges it with plugin hooks. Use `defineConfig` for type safety.

## Config file

Name the file `powerlines.config.ts`. The loader also accepts mode-specific variants such as `powerlines.development.config.js`. Source comments confirm TypeScript, JavaScript, `.mts`, and `.mjs` variants load through a Jiti resolver.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  input: "src/index.ts",
  output: { path: "dist" },
  platform: "node",
  logLevel: "info"
});
```

## Core fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `input` | file reference, array, or record | none | Entry modules. Paths resolve against `root`. |
| `output.path` | string | `{root}/dist` | Falls back to `tsconfig.json` `outDir`, then `dist`. |
| `output.artifactsPath` | string | `{root}/.powerlines` | Holds runtime artifacts from `prepare`. |
| `output.dts` | boolean | unset | Emit TypeScript declarations. |
| `output.types` | string or `false` | `{root}/powerlines.d.ts` | Set automatically when `dts` is `true`. |
| `output.format` | format or array | `esm` | Output module format. |
| `output.sourceMap` | boolean or string | unset | Use `true`, `"inline"`, or `"hidden"`. |
| `output.minify` | boolean | `false` | Minify output. |
| `output.storage` | preset or port | `virtual` | Use `"fs"`, `"virtual"`, or a custom `StoragePort`. |
| `output.overwrite` | boolean | `true` | Overwrite existing artifact files. |
| `platform` | string | `neutral` | Use `"node"`, `"browser"`, or `"neutral"`. |
| `logLevel` | string or object | `info` | Minimum severity, or per-category levels. |
| `resolve` | object | Vite-like defaults | Controls `mainFields`, `conditions`, `extensions`, `dedupe`, `alias`, `preserveSymlinks`, `external`, `noExternal`. |
| `define` | record | unset | Global constant replacements, like esbuild `define`. |
| `compatibilityDate` | date spec | latest | Pins feature compatibility behavior. |

## Plugins

Register plugins as a string, factory, object, tuple, array, or promise:

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [myPlugin({ verbose: true })]
});
```

The `config` hook merges plugin config into the resolved config. The `configEnvironment` hook adjusts per-environment config. Do not inject new plugins inside the `config` hook. User plugins resolve before that hook runs, so late additions have no effect.

## Engine startup options

`createPowerlines` accepts `EngineOptions`: `cwd`, `root`, `host`, `port`, `customLogger`, and `framework`. Set `root` to override config discovery. Set `host` and `port` to control the engine WebSocket server. Provide `customLogger` to replace the default logger.

## Precedence

Inline config passed to engine methods overrides file config. Plugin `config` hooks merge next. File values fill the rest.

## Gaps

- Environment variable names for config overrides are not defined in the inspected source. Treat env-based config as unverified.
- The full `UserConfig` field list extends beyond this page. Read `src/types/config.ts` in `@powerlines/core` for the complete contract.
