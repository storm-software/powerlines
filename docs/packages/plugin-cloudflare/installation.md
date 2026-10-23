---
title: Install cloudflare plugin
description: Install the Powerlines cloudflare plugin package.
documentType: getting-started
---

# Install the cloudflare plugin

The `@powerlines/plugin-cloudflare` package (v0.6.324) build and deploy Cloudflare Workers with Powerlines.

```sh
npm install @powerlines/plugin-cloudflare
# pnpm add @powerlines/plugin-cloudflare
# yarn add @powerlines/plugin-cloudflare
```

Also install `wrangler >= 4.77.0`, `@cloudflare/unenv-preset`, `@cloudflare/workers-types`, and `zod`.

The package ships ESM and CJS builds with types. Import the plugin factory from the package root.
