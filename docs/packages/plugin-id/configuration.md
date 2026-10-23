---
title: Configure the id plugin
description: Option reference for the Powerlines id plugin.
documentType: concept
---

# Configure the id plugin

Set options on the plugin call. They land under `config.id` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `nanoid` | `nanoid` | ID generation library. Unknown values warn and fall back to `nanoid`. |
