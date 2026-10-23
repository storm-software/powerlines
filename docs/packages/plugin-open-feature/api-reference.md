---
title: @powerlines/plugin-open-feature API reference
description: Exports and plugin hooks for @powerlines/plugin-open-feature.
documentType: recipe
---

# @powerlines/plugin-open-feature API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-open-feature` returns one or more Powerlines plugin objects. The primary plugin object is named `"open-feature" plus "open-feature:automd-generator"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-open-feature";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin returns two objects: `open-feature` and `open-feature:automd-generator`. It composes the Babel and Alloy plugins, so their config blocks apply too.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./components` | Runtime components. |
| `./components/features-builtin` | Built-in feature-flag component. |
| `./helpers` | Helper utilities. |
| `./helpers/automd-generator` | AutoMD doc generator. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `OpenFeaturePluginOptions` and related config types. |
