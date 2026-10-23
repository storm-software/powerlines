---
title: @powerlines/plugin-open-telemetry API reference
description: Exports and plugin hooks for @powerlines/plugin-open-telemetry.
documentType: recipe
---

# @powerlines/plugin-open-telemetry API reference

## Plugin factory

`plugin(options?)` from `@powerlines/plugin-open-telemetry` returns one or more Powerlines plugin objects. The primary plugin object is named `"open-telemetry" plus "open-telemetry:automd-generator"`. Register it through the `plugins` array in `defineConfig`.

```ts
import { plugin } from "@powerlines/plugin-open-telemetry";

export default defineConfig({
  plugins: [plugin()]
});
```

The plugin returns two objects: `open-telemetry` and `open-telemetry:automd-generator`. It composes the Babel, Alloy, and Env plugins, so their config blocks apply too.

## Exports

| Subpath | Contents |
| --- | --- |
| `.` | Plugin factory and shared types. |
| `./components` | Runtime components. |
| `./components/trace-builtin` | Built-in trace component. |
| `./helpers` | Helper utilities. |
| `./helpers/automd-generator` | AutoMD doc generator. |
| `./package.json` | Package version metadata. |
| `./schemas` | Validation schemas. |
| `./schemas/env` | Env schema. |
| `./types` | Public option and config types. |
| `./types/plugin` | `OpenTelemetryPluginOptions` and related config types. |
