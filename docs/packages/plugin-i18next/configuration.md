---
title: Configure the i18next plugin
description: Option reference for the Powerlines i18next plugin.
documentType: concept
---

# Configure the i18next plugin

Set options on the plugin call. They land under `config.i18next` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `extract` | DeepPartial of toolkit `extract` | resolved defaults | Extraction behavior. `output`, `primaryLanguage`, and `indentation` become required after resolution. |
| `types` | DeepPartial of toolkit `types` | resolved defaults | Type-generation behavior. `enableSelector` and `indentation` become required after resolution. |
| Full toolkit surface | various | toolkit defaults | `I18NextPluginOptions` is a deep partial of `I18nextToolkitConfig` from `i18next-cli`. |
