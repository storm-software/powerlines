---
title: @powerlines/plugin-image-compression API reference
description: Exports and plugin hooks for @powerlines/plugin-image-compression.
documentType: recipe
---

# @powerlines/plugin-image-compression API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-image-compression` returns one or more Powerlines plugin objects. The primary plugin object is named `"image-compression"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-image-compression";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes an `image-compression` hook object with a `config` hook that merges user settings into the resolved config. Use `filter` to limit which images are processed.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `ImageCompressionPluginOptions` and related config types. |
