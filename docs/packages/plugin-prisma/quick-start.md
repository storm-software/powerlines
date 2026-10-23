---
title: Quick start with @powerlines/plugin-prisma
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-prisma

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as prisma } from "@powerlines/plugin-prisma";

export default defineConfig({
  plugins: [prisma()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as prisma } from "@powerlines/plugin-prisma";

export default defineConfig({
  plugins: [prisma({ schema: "./prisma/schema.prisma" })],
  prisma: { schema: "./prisma/schema.prisma" }
});
```

## Expected result

Prisma client code is generated from the schema. Import the client in your app code.
