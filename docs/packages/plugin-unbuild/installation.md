---
title: Install the Unbuild plugin
description: Add @powerlines/plugin-unbuild to a Powerlines project.
documentType: getting-started
---

# Install the Unbuild plugin

Add the package to your project.

```bash
pnpm add @powerlines/plugin-unbuild
```

<details>
<summary>Using npm</summary>

```bash
npm install @powerlines/plugin-unbuild
```

</details>

<details>
<summary>Using yarn</summary>

```bash
yarn add @powerlines/plugin-unbuild
```

</details>

## Requirements

- The plugin builds with unbuild. Install the peer dependency:

```bash
pnpm add -D @storm-software/unbuild@">=0.57.0"
```

- The plugin registers itself through the `plugins` array in `powerlines.config.ts`. No extra setup is needed.
