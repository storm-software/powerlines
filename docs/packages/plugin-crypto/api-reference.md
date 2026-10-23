---
title: crypto API reference
description: Exports, hooks, and plugin factory for the Powerlines crypto plugin.
documentType: recipe
---

# crypto API reference

Package `@powerlines/plugin-crypto` v0.10.734.

## Plugin factory

`plugin(options = {})` returns `Plugin[]`: the `env` plugin plus the `crypto` plugin object. Resolved `crypto` config requires both `salt` and `encryptionKey` after resolution.

## Hooks

`config`, `configResolved`, `prepare`. Composes the `env` plugin. `configResolved` pins `@noble/ciphers` and `@noble/hashes` dependencies. `prepare` renders the `CryptoBuiltin` module.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin`, components, and types. |
| ``./components`` | Component index. |
| ``./components/crypto-builtin`` | Crypto builtin module component. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
