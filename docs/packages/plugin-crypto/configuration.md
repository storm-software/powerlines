---
title: Configure the crypto plugin
description: Option reference for the Powerlines crypto plugin.
documentType: concept
---

# Configure the crypto plugin

Set options on the plugin call. They land under `config.crypto` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `salt` | string | generated | Salt value. Falls back to `SALT` env, then a random value with a warning. |
| `encryptionKey` | string | generated | Encryption key. Falls back to `ENCRYPTION_KEY` env, then a random value with a warning. |
| `env` | EnvPluginOptions | — | Forwarded to the composed `env` plugin. |
