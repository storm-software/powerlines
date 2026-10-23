---
title: Configure the date plugin
description: Option reference for the Powerlines date plugin.
documentType: concept
---

# Configure the date plugin

Set options on the plugin call. They land under `config.date` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `date-fns` \| `dayjs` \| `luxon` \| `moment` | `date-fns` | Date library. Unknown values warn and fall back. |
| `defaultLocale` | string | `en-US` | Default locale. Falls back to `DEFAULT_LOCALE` env. |
| `env` | EnvPluginOptions | — | Forwarded to the composed `env` plugin. |
