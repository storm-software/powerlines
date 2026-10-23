---
title: Configure the deepkit plugin
description: Option reference for the Powerlines deepkit plugin.
documentType: concept
---

# Configure the deepkit plugin

Set options on the plugin call. They land under `config.deepkit` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| All `TypeScriptCompilerPluginOptions` | various | tsc defaults | `DeepkitPluginOptions` is an alias of the `tsc` plugin options. |
| `order` | string | `pre` for tsc | Passed through to the composed `tsc` plugin. |
