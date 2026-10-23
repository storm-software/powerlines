---
title: Run Powerlines in your bundler
description: Create a Powerlines unplugin factory and register one builder adapter.
documentType: getting-started
---

# Run Powerlines in your bundler

`createUnpluginFactory` builds a plugin instance for one builder variant. It loads the Powerlines configuration, resolves the plugin configuration, and runs the build hooks (`buildStart`, `resolveId`, `load`, `transform`, `writeBundle`).

## Minimal setup

Pick the adapter subpath for your builder. This example uses Vite:

```ts
import { createUnpluginFactory } from "@powerlines/unplugin/unplugin";
import vite from "@powerlines/unplugin/vite";

const factory = createUnpluginFactory({ variant: "vite" });

export default vite(factory);
```

The exact registration call depends on the builder. The `unplugin` package exposes the raw factory adapter under `@powerlines/unplugin/unplugin`. Each builder subpath wraps it for that tool.

## Result

The plugin runs the Powerlines pipeline inside the host build: it prepares environments, resolves entry files, calls plugin hooks in `pre` / `normal` / `post` order, and finalizes output in `writeBundle`.

## Notes

- The README shows install commands only. It has no usage example. The pattern above comes from the `createUnpluginFactory` JSDoc and the adapter sources.
- An invalid `variant` throws an error that lists the valid builder variants.
