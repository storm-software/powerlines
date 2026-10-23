---
title: Configure the graphql plugin
description: Option reference for the Powerlines graphql plugin.
documentType: concept
---

# Configure the graphql plugin

Set options on the plugin call. They land under `config.graphql` in the resolved Powerlines config.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `schema` | string \| URL \| GraphQLSchema | — | Schema file path, fetchable URL, or loaded schema. |
| `filename` | string | — | Output filename. Supports path tokens. |
| `documents` | various | [] | Extra documents for codegen. |
| `plugins`, `pluginMap`, `config` | various | {} defaults | Forwarded GraphQL codegen options. |
| Other codegen options | various | upstream defaults | All `@power-plant/graphql-codegen` options except `schema`/`schemaAst`. |
