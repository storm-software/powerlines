---
title: Configure the esbuild plugin
description: Option reference for the Powerlines esbuild plugin.
documentType: concept
---

# Configure the esbuild plugin

Set options on the plugin call. They land under `config.esbuild` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| Any esbuild `BuildOptions` except reserved keys | various | esbuild defaults | `EsbuildOptions` omits `entryPoints`, `platform`, `outdir`, `env`, `assets`, `external`, `inject`, `tsconfig`, `tsconfigRaw`, `logLevel` — Powerlines manages those. |
| Entry points | — | managed | Resolved from the Powerlines `entry` config. |
