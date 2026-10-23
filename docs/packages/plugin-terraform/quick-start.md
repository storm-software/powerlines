---
title: Deploy with Terraform
description: Register the Terraform plugin and deploy a stack.
documentType: getting-started
---

# Deploy with Terraform

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as terraform } from "@powerlines/plugin-terraform";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [terraform()]
});
```

Run the deploy command. The plugin generates the stack name from the
organization, workspace, project, and mode when `stackName` is omitted:

```ts
export default defineConfig({
  plugins: [
    terraform({
      stackName: "my-org-my-project-production",
      autoApproval: true
    })
  ]
});
```

> [!WARNING]
> `destroy: true` runs `terraform destroy` instead of `terraform apply`.
> Use it only in CI/CD pipelines.
