---
title: Configure the hey-api plugin
description: Option reference for the Powerlines hey-api plugin.
documentType: concept
---

# Configure the hey-api plugin

Set options on the plugin call. They land under `config.hey-api` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `schema` | HeyAPI input | — | OpenAPI document, file path, or fetchable URL. |
| `output` | HeyAPI output + `path` | — | Hey API output options plus an optional output path. |
| Other Hey API options | various | upstream defaults | All `@hey-api/openapi-ts` user config except `input`, `output`, `schema`. |
