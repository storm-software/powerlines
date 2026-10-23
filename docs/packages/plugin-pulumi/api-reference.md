---
title: @powerlines/plugin-pulumi API reference
description: Exports and plugin hooks for @powerlines/plugin-pulumi.
documentType: recipe
---

# @powerlines/plugin-pulumi API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-pulumi` returns one or more Powerlines plugin objects. The primary plugin object is named `"pulumi"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-pulumi";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes a `pulumi` object. Its context carries the live Pulumi `Stack`, so hooks can read deployment outputs.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `PulumiPluginOptions` and related config types. |
| `./types/pulumi` | Pulumi automation re-export types. |
