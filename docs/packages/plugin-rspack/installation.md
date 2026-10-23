---
title: Install the Rspack plugin
description: Add @powerlines/plugin-rspack to a Powerlines project.
documentType: getting-started
---

# Install the Rspack plugin

Add the package to your project.

```bash
pnpm add @powerlines/plugin-rspack
```

<details>
<summary>Using npm</summary>

```bash
npm install @powerlines/plugin-rspack
```

</details>

<details>
<summary>Using yarn</summary>

```bash
yarn add @powerlines/plugin-rspack
```

</details>

## Requirements

- The plugin builds with Rspack. Install the peer dependency:

```bash
pnpm add -D @rspack/core@">=1.5.0"
```

- The plugin registers itself through the `plugins` array in `powerlines.config.ts`. No extra setup is needed.
