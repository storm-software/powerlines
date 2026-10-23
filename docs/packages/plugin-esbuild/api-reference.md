---
title: esbuild API reference
description: Exports, hooks, and plugin factory for the Powerlines esbuild plugin.
documentType: recipe
---

# esbuild API reference

Package `@powerlines/plugin-esbuild` v0.13.671.

## Plugin factory

`plugin(options = {})` returns a single `Plugin` named `esbuild`. Resolved config exposes `esbuild: EsbuildOptions`. Requires peer `esbuild >= 0.27.3`.

## Hooks

`config`, `build`. `config` sets ESM output format. `build` resolves entry points, wires Powerlines unplugins through `createEsbuildPlugin`, and runs the esbuild `build`.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin`. |
| ``./types`` | Type index. |
| ``./types/build`` | `EsbuildOptions`. |
| ``./types/plugin`` | `EsbuildPluginOptions`, user config, resolved config, context. |
| ``./package.json`` | Package manifest. |
