---
title: @powerlines/plugin-prisma API reference
description: Exports and plugin hooks for @powerlines/plugin-prisma.
documentType: recipe
---

# @powerlines/plugin-prisma API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-prisma` returns one or more Powerlines plugin objects. The primary plugin object is named `"prisma"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-prisma";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes a `prisma` object. It composes the Pulumi and Power Plant plugins, so their config blocks apply too.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `PrismaPluginOptions` and related config types. |
