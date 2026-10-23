---
title: Install the Vite plugin
description: Add @powerlines/plugin-vite to a Powerlines project.
documentType: getting-started
---

# Install the Vite plugin

Add the package to your project.

```bash
pnpm add @powerlines/plugin-vite
```

<details>
<summary>Using npm</summary>

```bash
npm install @powerlines/plugin-vite
```

</details>

<details>
<summary>Using yarn</summary>

```bash
yarn add @powerlines/plugin-vite
```

</details>

## Requirements

- The plugin builds with Vite. Install the peer dependency:

```bash
pnpm add -D vite@">=8.0.0"
```

- The plugin registers itself through the `plugins` array in `powerlines.config.ts`. No extra setup is needed.
