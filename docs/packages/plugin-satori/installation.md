---
title: Install the Satori plugin
description: Add @powerlines/plugin-satori to a Powerlines project.
documentType: getting-started
---

# Install the Satori plugin

Add the package to your project.

```bash
pnpm add @powerlines/plugin-satori
```

<details>
<summary>Using npm</summary>

```bash
npm install @powerlines/plugin-satori
```

</details>

<details>
<summary>Using yarn</summary>

```bash
yarn add @powerlines/plugin-satori
```

</details>

## Requirements

- The plugin renders with Satori and React. Install the peer dependencies:

```bash
pnpm add react@">=19.2.0" react-dom@">=19.2.0"
```

- The plugin registers itself through the `plugins` array in `powerlines.config.ts`. No extra setup is needed.
