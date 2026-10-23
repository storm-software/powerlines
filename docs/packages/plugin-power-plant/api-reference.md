---
title: @powerlines/plugin-power-plant API reference
description: Exports and plugin hooks for @powerlines/plugin-power-plant.
documentType: recipe
---

# @powerlines/plugin-power-plant API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-power-plant` returns one or more Powerlines plugin objects. The primary plugin object is named `"power-plant" (or "power-plant:<name>")`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-power-plant";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin context adds a `powerplant` helper with `execute(options)` and the resolved `options`. Generation runs through the Power Plant engine (`ExecuteFunction`).

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./helpers` | Helper utilities. |
| `./helpers/extract` | Spec extraction helper. |
| `./helpers/storage-adapter` | Storage adapter helper. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `PowerPlantPluginOptions` and related config types. |
