---
title: Quick start with @powerlines/plugin-marked
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-marked

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as marked } from "@powerlines/plugin-marked";

export default defineConfig({
  plugins: [marked()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as marked } from "@powerlines/plugin-marked";

export default defineConfig({
  plugins: [marked({ gfm: true })],
  marked: { gfm: true, breaks: false }
});
```

Call `this.marked.parse(src)` inside other hooks to render Markdown strings.

## Expected result

Markdown inputs are rendered to HTML strings through the shared Marked instance.
