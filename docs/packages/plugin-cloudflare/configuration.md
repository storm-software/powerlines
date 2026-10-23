---
title: Configure the cloudflare plugin
description: Option reference for the Powerlines cloudflare plugin.
documentType: concept
---

# Configure the cloudflare plugin

Set options on the plugin call. They land under `config.cloudflare` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `accountId` | string | — | Cloudflare account ID. |
| `apiToken` | string | — | Cloudflare API token. |
| `configPath` | string | auto-detected | Wrangler config path. |
| `domain` | string | — | Worker domain. |
| `unenv` | UnenvPluginOptions | — | Forwarded to the `unenv` plugin. |
| `pulumi` | PulumiPluginOptions | — | Forwarded to the `pulumi` plugin with one entry per worker. |
