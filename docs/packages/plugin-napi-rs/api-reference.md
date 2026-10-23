---
title: @powerlines/plugin-napi-rs API reference
description: Exports and plugin hooks for @powerlines/plugin-napi-rs.
documentType: recipe
---

# @powerlines/plugin-napi-rs API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-napi-rs` returns one or more Powerlines plugin objects. The primary plugin object is named `"napi-rs"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-napi-rs";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes an `napi-rs` object with a `config` hook. It composes the Babel and Alloy plugins, so their config blocks apply too.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./helpers/format-path` | Path formatting helper. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `NapiPluginOptions` and related config types. |
| `./types/targets` | `Target` and `TargetTriple` types. |
| `./types/wasm` | `WasmOptions` type. |
