---
title: content-collections API reference
description: Exports, hooks, and plugin factory for the Powerlines content-collections plugin.
documentType: recipe
---

# content-collections API reference

Package `@powerlines/plugin-content-collections` v0.1.678.

## Plugin factory

`plugin(options)` returns a single `Plugin` named `content-collections`. Context exposes `contentCollections.context`, `.build()`, and `.on` event subscription. Requires peer `@content-collections/core >= 0.12.3`.

## Hooks

`config`, `configResolved`, `prepare`. `configResolved` reads the Content Collections config, checksums it, and builds a build context with a Powerlines-backed writer. `prepare` runs the build.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin`, helpers, and types. |
| ``./helpers`` | Helper index. |
| ``./helpers/create-emitter`` | Build-event emitter factory. |
| ``./helpers/create-writer`` | Writer wired to the Powerlines filesystem. |
| `Other helper paths` | See the export map for the full list. |
