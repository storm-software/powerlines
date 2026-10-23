---
title: @powerlines/plugin-jest API reference
description: Exports and plugin hooks for @powerlines/plugin-jest.
documentType: recipe
---

# @powerlines/plugin-jest API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-jest` returns one or more Powerlines plugin objects. The primary plugin object is named `"jest"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-jest";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin exposes a `jest` object with an async `config` hook. It reads `test.jest` from the resolved config and forwards the values to Jest.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./package.json` | Package version metadata. |
| `./types` | Public option and config types. |
| `./types/plugin` | `JestPluginOptions` and related config types. |
