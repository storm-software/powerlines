---
title: @powerlines/plugin-nodejs API reference
description: Exports and plugin hooks for @powerlines/plugin-nodejs.
documentType: recipe
---

# @powerlines/plugin-nodejs API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-nodejs` returns one or more Powerlines plugin objects. The primary plugin object is named `"nodejs"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-nodejs";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes a `nodejs` object. Its context extends the Env plugin context, so env helpers are available in hooks.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./components` | Runtime components. |
| `./components/env-builtin` | Built-in env component. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `NodeJsPluginOptions` and related config types. |
