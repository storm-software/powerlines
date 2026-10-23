---
title: Configure the biome plugin
description: Option reference for the Powerlines biome plugin.
documentType: concept
---

# Configure the biome plugin

Set options on the plugin call. They land under `config.biome` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `configFile` | string | auto-detected | `biome.json` or `biome.jsonc` in root or cwd. Required when none exists. |
| `fix` | boolean \| `unsafe` | true | Apply safe fixes while linting. |
| `maxDiagnostics` | number | 20 | Maximum diagnostics reported. |
| `diagnosticLevel` | `error` \| `warn` \| `info` | `info` | Minimum level shown. |
| `format` | stylish \| compact \| json \| json-pretty \| junit \| github | `stylish` | Output format. |
| `logKind` | `pretty` \| `compact` \| `json` | `pretty` | Log rendering. |
| `vcsEnabled` | boolean | true | Respect VCS ignore files. |
| `vcsDefaultBranch` | string | `main` | Branch used for VCS comparison. |
| `filesMaxSize` / `filesIgnoreUnknown` | number / boolean | — | File-size and unknown-file handling. |
| `reporter`, `only`, `skip`, `staged`, more | various | — | Full CLI-equivalent surface. See `BiomePluginOptions`. |
