---
title: Configure @powerlines/plugin-prisma
description: Options for the prisma config block.
documentType: concept
---

# Configure @powerlines/plugin-prisma

Set options on the `prisma` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  prisma: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `schema` | `string` | — |
| `serviceToken` | `string` | — |
| `prismaPostgres` | `PrismaPostgresPrismaPluginOptions \| true` | — |
| `pulumi` | `PulumiPluginOptions` | — |
| `projectId` | `string` | — |
| `region` | `AWS region string` | — |
| `databaseName` | `string` | — |

`PrismaPluginOptions` extends the `@power-plant/prisma` generator options minus `schemaPath`. `prismaPostgres` provisions a Prisma Postgres database when set. The plugin also accepts a Pulumi block for infra. No defaults are stated in the plugin source.
