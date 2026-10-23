---
title: capnp API reference
description: Exports, hooks, and plugin factory for the Powerlines capnp plugin.
documentType: recipe
---

# capnp API reference

Package `@powerlines/plugin-capnp` v0.1.681.

## Plugin factory

`plugin(options = {})` returns a single `Plugin` named `capnp`. Warns and skips when no schemas resolve. Path tokens such as `{builtinPath}` are supported.

## Hooks

`config`, `configResolved`, `prepare`. `configResolved` expands path tokens in `outputPath`. `prepare` compiles schemas with `capnpc`; output inside the builtins path is emitted with `emitBuiltin`, otherwise written to disk.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` and all types. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
| ``./types/plugin`` | `CapnpPluginOptions`, user config, resolved config, context. |
