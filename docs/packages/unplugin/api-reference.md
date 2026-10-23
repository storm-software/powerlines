---
title: Powerlines unplugin API reference
description: Factory function, adapter subpaths, and types of @powerlines/unplugin.
documentType: recipe
---

# Powerlines unplugin API reference

Package: `@powerlines/unplugin`. The package description in `package.json` calls it "a Powerlines plugin to assist in developing other Powerlines plugins."

## Functions

### `createUnpluginFactory(options, decorate?)`

Creates a Powerlines unplugin factory for one builder variant. Defined in `src/unplugin.ts`.

- `options: UnpluginFactoryOptions` — requires `variant`. See [configuration](configuration.md).
- `decorate: UnpluginFactoryDecorator` — optional function that maps the built `UnpluginOptions` to a partial override. Defaults to the identity function.
- Returns `UnpluginFactory<TContext>`: a function `(options, meta) => UnpluginOptions<TContext>`.
- Throws when `variant` is not a valid unplugin builder variant.
- The module also re-exports everything from `@powerlines/core/lib/unplugin`. That surface was not inspected.

```ts
import { createUnpluginFactory } from "@powerlines/unplugin";

const factory = createUnpluginFactory({
  variant: "vite",
  framework: "my-framework",
  orgId: "my-org",
  customLogger: myCustomLogger
});
```

This example comes from the JSDoc on `createUnpluginFactory`. The `framework`, `orgId`, and factory-level `customLogger` fields belong to the base `Options` type and were not verified against its source.

## Adapter subpaths

One subpath per supported builder. Each has ESM (`.mjs`) and CJS (`.cjs`) builds:

| Subpath | Builder |
| --- | --- |
| `@powerlines/unplugin/astro` | Astro |
| `@powerlines/unplugin/esbuild` | esbuild |
| `@powerlines/unplugin/farm` | Farm |
| `@powerlines/unplugin/next` | Next.js |
| `@powerlines/unplugin/nuxt` | Nuxt |
| `@powerlines/unplugin/rolldown` | Rolldown |
| `@powerlines/unplugin/rollup` | Rollup |
| `@powerlines/unplugin/rspack` | Rspack |
| `@powerlines/unplugin/tsdown` | tsdown |
| `@powerlines/unplugin/tsup` | tsup |
| `@powerlines/unplugin/unplugin` | Raw unplugin factory adapter |
| `@powerlines/unplugin/vite` | Vite |
| `@powerlines/unplugin/webpack` | webpack |
| `@powerlines/unplugin/unloader` | unloader |

The package entry (`@powerlines/unplugin`) exports a `plugins` map with one entry per adapter above, plus a default export of the same map. It also re-exports all of `./types` and `./unplugin`.

## Types

From `src/types.ts`:

- `UnpluginExecutionOptions` — build inline config minus `command`, plus optional `cwd`, `configFile`, `framework`, `root`, and `configIndex`.
- `UnpluginExecutionOptionsBase` — execution options with `cwd`, `configFile`, `framework`, `root`, and `configIndex` optional and `executionId` omitted.
- `UnpluginFactory<TContext>` — `(options, meta) => UnpluginOptions<TContext>`.
- All types from `@powerlines/core/types/unplugin` are re-exported. That module was not inspected.

The `types` subpath (`@powerlines/unplugin/types`) exposes the compiled type entry.

## Gaps

- Only `src/vite.ts` was partially inspected. The other adapters and their `resolveOptions` functions were not inspected.
- The base `Options` type from `@powerlines/core` was not inspected. Factory-level fields such as `framework` and `orgId` are unverified.
- The re-exported surface from `@powerlines/core/lib/unplugin` and `@powerlines/core/types/unplugin` was not inspected.
- Per-builder registration calls (how each adapter wraps the factory) were not verified against tests or examples.
