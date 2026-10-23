---
title: @powerlines/plugin-oxc-transform API reference
description: Exports and plugin hooks for @powerlines/plugin-oxc-transform.
documentType: recipe
---

# @powerlines/plugin-oxc-transform API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-oxc-transform` returns one or more Powerlines plugin objects. The primary plugin object is named `"oxc-transform"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-oxc-transform";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes an `oxc-transform` object. Transform behavior is fully defined by the underlying `oxc-transform` package.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `OxcTransformPluginOptions` and related config types. |
