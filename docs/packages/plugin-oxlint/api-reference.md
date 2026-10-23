---
title: @powerlines/plugin-oxlint API reference
description: Exports and plugin hooks for @powerlines/plugin-oxlint.
documentType: recipe
---

# @powerlines/plugin-oxlint API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-oxlint` returns one or more Powerlines plugin objects. The primary plugin object is named `"oxlint"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-oxlint";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes an `oxlint` object. Use the `./helpers/generate-config` export to write an Oxlint config file from plugin options.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./helpers` | Helper utilities. |
| `./helpers/generate-config` | Config-file generator. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `OxlintPluginOptions` and related config types. |
