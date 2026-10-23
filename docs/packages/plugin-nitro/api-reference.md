---
title: @powerlines/plugin-nitro API reference
description: Exports and plugin hooks for @powerlines/plugin-nitro.
documentType: recipe
---

# @powerlines/plugin-nitro API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-nitro` returns one or more Powerlines plugin objects. The primary plugin object is named `"nitro:config" plus "nitro:init", "nitro:vite"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-nitro";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin returns several objects (`nitro:config`, `nitro:init`, `nitro:vite`, and others). The context exposes `nitro`, `pluginConfig`, `dev`, and `services`. The exact inner plugin list is an implementation detail; rely on the `nitro` config block.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `NitroPluginOptions` and context types. |
