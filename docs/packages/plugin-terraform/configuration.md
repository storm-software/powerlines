---
title: Configure the Terraform plugin
description: Options and config keys for the Terraform plugin.
documentType: concept
---

# Configure the Terraform plugin

The plugin reads options from the `terraform` config key.

```ts
export default defineConfig({
  plugins: [terraform({ planFile: "plan.out" })],
  terraform: {
    autoApproval: false,
    lock: true
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `stackName` | `string` | `{organization}-{workspace}-{project}-{mode}` |
| `autoApproval` | `boolean` | `false` |
| `planFile` | `string` | `"plan.out"` |
| `formatWrite` | `boolean` | `false` |
| `upgrade` | `boolean` | `false` |
| `destroy` | `boolean` | `false` |
| `migrateState` | `boolean` | `false` |
| `lock` | `boolean` | `false` |
| `varFile` | `string` | None |
| `reconfigure` | `boolean` | `false` |

> [!NOTE]
> Gap: further fields may exist below the inspected section of
> `TerraformPluginOptions`. Check `src/types/plugin.ts` for the full list.
