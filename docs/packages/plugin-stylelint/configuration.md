---
title: Configure the Stylelint plugin
description: Options and config keys for the Stylelint plugin.
documentType: concept
---

# Configure the Stylelint plugin

The plugin reads options from the `stylelint` config key. Options extend
`Partial<LinterOptions>` from Stylelint.

```ts
export default defineConfig({
  plugins: [stylelint({ fix: true })],
  stylelint: {
    configFile: "stylelint.config.mjs",
    silent: false
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `configFile` | `string` | Stylelint discovery. |
| `outputFile` | `string` | None. Writes lint results to a file. |
| `silent` | `boolean` | `false` |
| `fix` | `boolean \| FixMode` | `true` |
| Any `LinterOptions` field | Same as Stylelint | Stylelint defaults |

`StylelintPluginOptions` extends `Partial<LinterOptions>`, so every
Stylelint linter option is accepted.
