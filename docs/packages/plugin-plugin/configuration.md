---
title: Configure the Powerlines plugin helper
description: Read the default config and override tsdown options.
documentType: concept
---

# Configure the Powerlines plugin helper

`plugin(options)` accepts `PluginPluginOptions` and returns an array of two plugins: the tsdown plugin built from the same options, and a defaults plugin named `"plugin"`.

## Options

`PluginPluginOptions` extends `TsdownPluginOptions` from `@powerlines/plugin-tsdown`. That parent type was not inspected. The helper adds one field:

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `types` | `PluginPluginTypesOptions` | — | Type definition references with optional `options` and `userConfig` file inputs. |

Pass any tsdown option alongside `types`. The same object flows into the tsdown plugin.

## Default configuration

The `"plugin"` entry supplies this config in its `config()` hook:

| Path | Value |
| --- | --- |
| `type` | `"library"` |
| `platform` | `"node"` |
| `output.format` | `["cjs", "esm"]` |
| `output.dts` | `true` |
| `output.minify` | `false` |
| `output.types` | `false` |
| `resolve.external` | `["powerlines", /^@powerlines\//, /^@power-plant\//]` |
| `tsdown.target` | `"esnext"` |
| `tsdown.cjsDefault` | `true` |
| `tsdown.nodeProtocol` | `true` |
| `tsdown.fixedExtension` | `true` |
| `tsdown.unbundle` | `false` |

Your own config values merge with these defaults through the normal Powerlines config chain.

## Input resolution

The `configResolved` hook runs with order `"pre"`. When `config.input` is missing or an empty array, it sets the input to `src/index.tsx` if that file exists under the config root, else `src/index.ts`. Set `input` explicitly to skip this step.

## Module augmentation

The package augments the `powerlines` module: the `Config` interface gains an optional `plugin?: PluginPluginOptions` field. Plugin users set their options under the `plugin` config key.
