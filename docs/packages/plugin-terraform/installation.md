---
title: Install the Terraform plugin
description: Add @powerlines/plugin-terraform to a Powerlines project.
documentType: getting-started
---

# Install the Terraform plugin

Add the package to your project.

```bash
pnpm add @powerlines/plugin-terraform
```

<details>
<summary>Using npm</summary>

```bash
npm install @powerlines/plugin-terraform
```

</details>

<details>
<summary>Using yarn</summary>

```bash
yarn add @powerlines/plugin-terraform
```

</details>

## Requirements

- The plugin has no peer dependencies. The `terraform` CLI must be on PATH.
- The plugin registers itself through the `plugins` array in `powerlines.config.ts`. No extra setup is needed.
