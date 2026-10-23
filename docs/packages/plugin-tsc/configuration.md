---
title: Configure the TSC plugin
description: Options and config keys for the TSC plugin.
documentType: concept
---

# Configure the TSC plugin

The plugin reads options from the `tsc` config key. Options extend
`Partial<Omit<ts.TranspileOptions, "fileName">>`.

```ts
export default defineConfig({
  plugins: [tsc({ typeCheck: true })],
  tsc: {
    typeCheck: true
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `typeCheck` | `boolean` | Required. Enables type-checking. |
| `filter` | `HookFilter` | Matches `.ts`, `.cts`, `.mts`, `.tsx`, and `.d.ts` files. |
| `order` | `"pre" \| "post"` | Hook order. |
| Any `ts.TranspileOptions` field except `fileName` | Same as TypeScript | TypeScript defaults |

The `filename` field is omitted because the plugin sets it per file.
