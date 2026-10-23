---
title: Configure the capnp plugin
description: Option reference for the Powerlines capnp plugin.
documentType: concept
---

# Configure the capnp plugin

Set options on the plugin call. They land under `config.capnp` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `schema` | string \| URL | required (`*.capnp` default) | Schema glob, file, or URL. |
| `outputPath` | string | required (`{builtinPath}/capnp` default) | Generated-file directory. Supports path tokens. |
| `ts` | boolean | true | Emit TypeScript sources. |
| `js` | boolean | false | Emit JavaScript sources. |
| `dts` | boolean | false | Emit declaration files. |
| `tty` | boolean | true | TTY output for the compiler. |
| Other `CapnpcOptions` | various | upstream defaults | `CapnpPluginOptions` extends `CapnpcOptions` minus `workspaceRoot`, `projectRoot`, `schemas`. |
