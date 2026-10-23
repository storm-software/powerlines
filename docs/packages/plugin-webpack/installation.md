---
title: Install the Webpack plugin
description: Add @powerlines/plugin-webpack to a Powerlines project.
documentType: getting-started
---

# Install the Webpack plugin

Add the package to your project.

```bash
pnpm add @powerlines/plugin-webpack
```

<details>
<summary>Using npm</summary>

```bash
npm install @powerlines/plugin-webpack
```

</details>

<details>
<summary>Using yarn</summary>

```bash
yarn add @powerlines/plugin-webpack
```

</details>

## Requirements

- The plugin builds with Webpack. Install the peer dependency:

```bash
pnpm add -D webpack@">=5.101.0"
```

- The plugin registers itself through the `plugins` array in `powerlines.config.ts`. No extra setup is needed.
