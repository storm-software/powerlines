---
title: Configure the asyncapi plugin
description: Option reference for the Powerlines asyncapi plugin.
documentType: concept
---

# Configure the asyncapi plugin

Set options on the plugin call. They land under `config.asyncapi` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `schema` | string \| URL \| Record | required | AsyncAPI document, file path, or fetchable URL. |
| `templateName` | string | required | AsyncAPI generator template name. |
| `outputPath` | string | required | Directory for generated output. |
| `entrypoint` | string | — | Template entrypoint override. |
| `templateParams` | Record<string, unknown> | — | Parameters passed to the template. |
| `noOverwriteGlobs` | string[] | — | Globs never overwritten. |
| `disabledHooks` | Record<string, boolean \| string \| string[]> | — | Hooks to disable. |
| `registry` | string \| object | — | Template registry URL and auth. |
| `forceWrite` | boolean | — | Overwrite output files. |
| `debug` | boolean | mode-derived | Enable generator debug output. |
| `compile` | boolean | false | Compile the generated project. |
| `mapBaseUrlToFolder` | Record<string, string> | — | Map schema URLs to folders. |
| `output` | `fs` \| `string` | `string` | Write to disk or keep in memory. |
| `install` | boolean | false | Install dependencies of generated output. |
