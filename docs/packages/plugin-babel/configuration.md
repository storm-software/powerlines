---
title: Configure the babel plugin
description: Option reference for the Powerlines babel plugin.
documentType: concept
---

# Configure the babel plugin

Set options on the plugin call. They land under `config.babel` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `plugins` | BabelTransformPluginOptions[] | [] | Babel plugins. Deduped at `configResolved`. |
| `presets` | BabelTransformPresetOptions[] | [] | Babel presets. Deduped at `configResolved`. |
| `skipConfigResolution` | boolean | — | Skip automatic config resolution (used by the Alloy plugin). |
| `skipTransform` | boolean | — | Skip the transform step. |
| Other `InputOptions` | various | Babel defaults | `BabelUserConfig` extends Babel `InputOptions` minus `plugins`/`presets`. |
