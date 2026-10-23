---
title: Terraform plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-terraform.
documentType: recipe
---

# Terraform plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `TerraformPluginOptions`. Returns
Powerlines plugins named `"terraform"`.

```ts
import { plugin } from "@powerlines/plugin-terraform";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default Terraform configuration. |
| `configResolved` | Resolves the stack name and flags. |
| `deploy` | Runs `terraform apply` (or `destroy`). |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `TerraformPluginOptions`, user config, resolved config, context. |
| `./types/terraform` | `TerraformContext` types. |
| `./package.json` | Package metadata. |

## Related types

- `TerraformPluginOptions` — stack name, plan, and apply flags.
- `TerraformPluginUserConfig` — adds `terraform` key to `UserConfig`.
- `TerraformPluginResolvedConfig` — resolved config with `terraform`.
- `TerraformPluginContext` — plugin context with `terraform: TerraformContext`.
