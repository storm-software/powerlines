---
title: biome API reference
description: Exports, hooks, and plugin factory for the Powerlines biome plugin.
documentType: recipe
---

# biome API reference

Package `@powerlines/plugin-biome` v0.2.684.

## Plugin factory

`plugin(options = {})` returns a single `Plugin` named `biome`. Throws at `config` time when no Biome config file exists and none is given.

## Hooks

`config`, `lint`. The `lint` hook runs the Biome binary with `--log-level` derived from the Powerlines log level and forwards `params` when set.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` and all types. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
| ``./types/plugin`` | `BiomePluginOptions`, user config, resolved config, context. |

> [!NOTE]
> Requires peer `@biomejs/biome >= 2.0.0`, installed by the consumer.
