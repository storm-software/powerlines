---
title: @powerlines/plugin-rollup API reference
description: Exports and plugin hooks for @powerlines/plugin-rollup.
documentType: recipe
---

# @powerlines/plugin-rollup API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-rollup` returns one or more Powerlines plugin objects. The primary plugin object is named `"rollup"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-rollup";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes a `rollup` object. The `./helpers/unplugin` export bridges Rollup plugins from the unplugin ecosystem.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./helpers` | Helper utilities. |
| `./helpers/resolve-options` | Option resolution helper. |
| `./helpers/unplugin` | Unplugin interop helper. |
| `./types` | Public option and config types. |
| `./types/plugin` | `RollupPluginOptions` and related config types. |
| `./package.json` | Package version metadata. |
