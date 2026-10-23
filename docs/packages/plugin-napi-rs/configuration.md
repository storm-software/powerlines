---
title: Configure @powerlines/plugin-napi-rs
description: Options for the napi config block.
documentType: concept
---

# Configure @powerlines/plugin-napi-rs

Set options on the `napi` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  napi: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `binaryName` | `string` | — |
| `packageName` | `string` | — |
| `buildOutputDir` | `string` | — |
| `npmDir` | `string` | — |
| `target` | `TargetTriple \| Target` | — |
| `targets` | `(TargetTriple \| Target)[]` | — |
| `profile` | `string` | — |
| `wasm` | `WasmOptions` | — |
| `release` | `boolean` | — |
| `features` | `string[]` | — |
| `allFeatures` | `boolean` | — |
| `noDefaultFeatures` | `boolean` | — |
| `jsBinding` | `string` | — |
| `dts` | `string` | — |
| `manifestPath` | `string` | — |
| `configPath` | `string` | — |
| `outputDir` | `string` | — |
| `targetDir` | `string` | — |
| `packageJsonPath` | `string` | — |
| `platform` | `boolean` | — |
| `npmClient` | `string` | — |
| `constEnum` | `boolean` | — |
| `noJsBinding` | `boolean` | — |
| `dtsHeader` | `string` | — |
| `dtsHeaderFile` | `string` | — |
| `noDtsHeader` | `boolean` | — |
| `dtsCache` | `boolean` | — |
| `strip` | `boolean` | — |
| `crossCompile` | `boolean` | — |
| `useCross` | `boolean` | — |
| `useNapiCross` | `boolean` | — |

Options map to `@napi-rs/cli` flags. Target values use the `Target` and `TargetTriple` types in `./types/targets`; WASM settings use `WasmOptions` in `./types/wasm`. No defaults are stated in the plugin source.
