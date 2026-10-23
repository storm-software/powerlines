---
title: id API reference
description: Exports, hooks, and plugin factory for the Powerlines id plugin.
documentType: recipe
---

# id API reference

Package `@powerlines/plugin-id` v0.9.687.

## Plugin factory

`plugin(options = {})` returns a single `Plugin` named `id`. Resolved `id` config requires `type` after resolution.

## Hooks

`config`, `prepare`. `prepare` emits the selected ID module as the `id` builtin.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin`, components, and types. |
| ``./components`` | Component index. |
| ``./components/nanoid`` | nanoid module component. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
