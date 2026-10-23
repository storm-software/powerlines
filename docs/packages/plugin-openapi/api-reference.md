---
title: @powerlines/plugin-openapi API reference
description: Exports and plugin hooks for @powerlines/plugin-openapi.
documentType: recipe
---

# @powerlines/plugin-openapi API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-openapi` returns one or more Powerlines plugin objects. The primary plugin object is named `"openapi"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-openapi";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes an `openapi` object with a `config` hook. It builds on the Power Plant plugin, so generation runs through the `powerplant` engine.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `OpenAPIPluginOptions` and related config types. |
