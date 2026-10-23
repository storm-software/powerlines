---
title: @powerlines/plugin-react API reference
description: Exports and plugin hooks for @powerlines/plugin-react.
documentType: recipe
---

# @powerlines/plugin-react API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-react` returns one or more Powerlines plugin objects. The primary plugin object is named `"react"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-react";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes a `react` object. Its context extends the Env plugin context, so env helpers are available in hooks.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./components` | Runtime components. |
| `./components/react-optimized` | Optimized React component. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `ReactPluginOptions` and related config types. |
