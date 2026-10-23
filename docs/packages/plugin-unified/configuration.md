---
title: Configure the Unified plugin
description: Options and config keys for the Unified plugin.
documentType: concept
---

# Configure the Unified plugin

The plugin reads options from the `unified` config key.

```ts
export default defineConfig({
  plugins: [unified({ rules: [] })],
  unified: {
    rules: [
      {
        include: /\.md$/,
        exclude: /node_modules/,
        enforce: "pre",
        setup: processor => processor
      }
    ]
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `rules` | `UnifiedRule[]` | None |

## Rule fields

| Name | Type | Default |
| ---- | ---- | ------- |
| `include` | `FilterPattern \| ((id: string) => boolean)` | Required |
| `exclude` | `FilterPattern` | None |
| `enforce` | `"pre" \| "post" \| undefined` | None |
| `setup` | `(processor: Processor) => MaybePromise<Processor>` | Required |
| `transform.pre` | `(code, id) => MaybePromise<string \| void>` | None |
| `transform.post` | `(code, id, map?) => MaybePromise<string \| void \| { code, map? }>` | None |

The resolved config stores each rule with a `filter` function and a
`processor` promise.
