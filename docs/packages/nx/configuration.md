---
title: Configure the Powerlines Nx executors
description: Set executor options and register the Nx plugin nodes.
documentType: concept
---

# Configure the Powerlines Nx executors

Executors accept plain options in `project.json`. Options mirror the Powerlines command flags. The schema below comes from `src/executors/build/schema.json`. The other four executors (`clean`, `prepare`, `lint`, `docs`) each ship their own `schema.json`, but their fields were not inspected.

## Build executor options

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `config` / `configFile` | string (path) | — | Path to the Powerlines configuration file. The two names are aliases. |
| `configIndex` | number | `0` | Index into the configuration file when it holds an array of configurations. |
| `input` | string[] (paths) | — | Entry files for the project. |
| `entry` | string or string[] | `{}` | Entry paths for the package. |
| `tsconfig` | string (path) | — | Path to the tsconfig file. |
| `outputPath` | string (path) | — | Output directory for build artifacts. |
| `copyPath` | string (path) or `false` | `{}` | Directory to copy build artifacts into. |
| `sourceMap` | boolean | — | Generate a sourcemap. |
| `minify` | boolean | — | Minify the output. |
| `format` | `cjs`, `esm`, `iife` | — | Build formats. |
| `platform` | `neutral`, `node`, `browser` | — | Build platform. |
| `external` | string[] | — | Dependencies to treat as external. |
| `noExternal` | string[] | — | Dependencies to never treat as external. |
| `skipNodeModulesBundle` | boolean | — | Skip bundling `node_modules`. |
| `mode` | `development`, `test`, `production` | — | Build mode. |
| `logLevel` | log level | — | Log level, from `fatal` to `silent`. |
| `define` | object | `{}` | `define` values (`Record<string, string>`). |
| `assets` | array | `{}` | Asset entries with `input`, `output`, `glob`, `ignore`, and `dot` fields. |
| `additionalArgs` | object | `{}` | Extra arguments for the command (`Record<string, string>`). |
| `autoInstall` | boolean | — | Install dependencies during the prepare stage. |
| `skipCache` | boolean | — | Skip the build cache. |

## Nx plugin nodes

`src/plugin/index.ts` exports `createNodesV2`. It calls `createNxPlugin` from `../helpers/plugin-utilities` with `{ framework: "powerlines" }`. Register it as the Nx plugin entry when your workspace uses inferred targets. The helper module and its options type (`NxPluginOptions` in `src/types/plugin.ts`) were not inspected. See gaps in [api-reference](api-reference.md).
