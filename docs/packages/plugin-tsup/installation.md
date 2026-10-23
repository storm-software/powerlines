---
title: Install the Tsup plugin
description: Add @powerlines/plugin-tsup to a Powerlines project.
documentType: getting-started
---

# Install the Tsup plugin

Add the package to your project.

```bash
pnpm add @powerlines/plugin-tsup
```

<details>
<summary>Using npm</summary>

```bash
npm install @powerlines/plugin-tsup
```

</details>

<details>
<summary>Using yarn</summary>

```bash
yarn add @powerlines/plugin-tsup
```

</details>

## Requirements

- The plugin builds with tsup. Install the peer dependencies:

```bash
pnpm add -D tsup@">=8.4.0" @storm-software/tsup@">=0.57.0"
```

- The plugin registers itself through the `plugins` array in `powerlines.config.ts`. No extra setup is needed.
