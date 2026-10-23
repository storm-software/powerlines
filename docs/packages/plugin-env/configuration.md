---
title: Configure the env plugin
description: Option reference for the Powerlines env plugin.
documentType: concept
---

# Configure the env plugin

Set options on the plugin call. They land under `config.env` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `config` | SchemaConfig | required after resolution | Public env schema. |
| `secrets` | SchemaConfig | required after resolution | Secret env schema. |
| `prefix` | string \| string[] | — | Only expose variables with these prefixes. |
| `inject` | boolean | — | Inject values into the build. |
| `validate` | boolean | — | Validate values against the schemas. |
| `defaultConfig` | Children | required after resolution | Default Alloy config for the env builtin. |
| `babel` | BabelPluginOptions | — | Forwarded to the composed `babel` plugin. |
| `automd` | AutoMDPluginOptions | — | Forwarded to the composed `automd` plugin. |
| Other `DotenvConfiguration` | various | upstream defaults | Base dotenv behavior such as `additionalFiles`. |
