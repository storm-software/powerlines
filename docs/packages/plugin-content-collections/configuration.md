---
title: Configure the content-collections plugin
description: Option reference for the Powerlines content-collections plugin.
documentType: concept
---

# Configure the content-collections plugin

Set options on the plugin call. They land under `config.content-collections` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `configFile` | string | `{root}/content-collections.ts` | Content Collections config file. Supports path tokens. |
| `collections` | AnyCollection[] | [] | Collection definitions. |
| `outputPath` | string | builtins `content` dir | Generated output directory. Supports path tokens. |
