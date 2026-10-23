---
title: Configure the automd plugin
description: Option reference for the Powerlines automd plugin.
documentType: concept
---

# Configure the automd plugin

Set options on the plugin call. They land under `config.automd` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `configFile` | string | — | Path to an automd config file. |
| `allowIssues` | boolean | true | Allow issue references in generated docs. |
| `prefix` | string \| string[] | `automd`, `powerlines` | Generator prefixes. Adds the framework name when set. |
| `toc` | false \| TOCOptions | defaults | Table-of-contents options (`maxDepth`, `bullets`). See `./types/toc`. |
| `input` | string | `README.md` | Entry Markdown file (from automd `Config`). |
| `dir` / `watch` | — | managed | Controlled by the plugin from `config.root`. Do not set. |
