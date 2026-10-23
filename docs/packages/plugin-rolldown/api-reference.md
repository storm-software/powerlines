---
title: @powerlines/plugin-rolldown API reference
description: Exports and plugin hooks for @powerlines/plugin-rolldown.
documentType: recipe
---

# @powerlines/plugin-rolldown API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-rolldown` returns one or more Powerlines plugin objects. The primary plugin object is named `"rolldown"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-rolldown";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes a `rolldown` object. Bundle behavior is fully defined by the underlying Rolldown options.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./types` | Public option and config types. |
| `./types/build` | `RolldownOptions` build types. |
| `./types/plugin` | `RolldownPluginOptions` and related config types. |
| `./package.json` | Package version metadata. |
