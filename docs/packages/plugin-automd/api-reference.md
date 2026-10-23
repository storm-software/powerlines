---
title: automd API reference
description: Exports, hooks, and plugin factory for the Powerlines automd plugin.
documentType: recipe
---

# automd API reference

Package `@powerlines/plugin-automd` v0.1.678.

## Plugin factory

`plugin(options = {})` returns a single `Plugin` named `automd`. The resolved config is `automd: Config & Pick<AutoMDPluginOptions, configFile \| allowIssues \| toc>`.

## Hooks

`config`, `configResolved`. Runs the AutoMD Markdown transformer during the prepare task. `configResolved` appends the framework name to `prefix` and merges a `configFile` when set.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` (default) and all types. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
| ``./types/toc`` | `TOCOptions` for TOC generation. |
