---
title: Configure the eslint plugin
description: Option reference for the Powerlines eslint plugin.
documentType: concept
---

# Configure the eslint plugin

Set options on the plugin call. They land under `config.eslint` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `configFile` | string | — | ESLint config path. Flat config is assumed for `eslint.config.*` names. |
| `fix` | boolean | — | Write fixes with `ESLint.outputFixes`. |
| `reportErrorsOnly` | boolean | — | Drop warnings with `getErrorResults`. |
| `maxWarnings` | number | — | Warning budget (stored option). |
| `outputFile` | string \| null | — | Write the report to a file instead of logging it. |
| `type` | `base` \| `recommended` \| `strict` | — | Preset type (stored option). |
| `override` | Partial<ESLint.Options> | — | Raw ESLint constructor overrides. |
