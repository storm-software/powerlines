---
title: @powerlines/plugin-marked API reference
description: Exports and plugin hooks for @powerlines/plugin-marked.
documentType: recipe
---

# @powerlines/plugin-marked API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-marked` returns one or more Powerlines plugin objects. The primary plugin object is named `"marked"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-marked";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin context adds a `marked` helper with `parse(src, override?)` and `use(...)` from the `marked` package.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `MarkedPluginOptions` and context types. |
