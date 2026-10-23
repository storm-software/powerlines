---
title: Install @powerlines/plugin-napi-rs
description: Add @powerlines/plugin-napi-rs to a Powerlines project.
documentType: getting-started
---

# Install @powerlines/plugin-napi-rs

Builds N-API Rust modules and wires the JS bindings into the project.

## Install the package

```sh
npm install @powerlines/plugin-napi-rs
```

```sh
pnpm add @powerlines/plugin-napi-rs
```

```sh
yarn add @powerlines/plugin-napi-rs
```

## Peer dependencies

Install these alongside the plugin:

```sh
npm install @napi-rs/wasm-runtime (>=1.1.4)
```

> [!NOTE]
> Powerlines packages are versioned independently. Pin the plugin version to match your `powerlines` core version.
