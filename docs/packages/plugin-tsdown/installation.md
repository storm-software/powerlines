---
title: Install the Tsdown plugin
description: Add @powerlines/plugin-tsdown to a Powerlines project.
documentType: getting-started
---

# Install the Tsdown plugin

Add the package to your project.

```bash
pnpm add @powerlines/plugin-tsdown
```

<details>
<summary>Using npm</summary>

```bash
npm install @powerlines/plugin-tsdown
```

</details>

<details>
<summary>Using yarn</summary>

```bash
yarn add @powerlines/plugin-tsdown
```

</details>

## Requirements

- The plugin builds with tsdown. Install the peer dependencies:

```bash
pnpm add -D tsdown@">=0.21.2" publint@">=0.3.18" @arethetypeswrong/core@">=0.18.4"
```

- The plugin registers itself through the `plugins` array in `powerlines.config.ts`. No extra setup is needed.
