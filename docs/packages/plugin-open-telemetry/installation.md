---
title: Install @powerlines/plugin-open-telemetry
description: Add @powerlines/plugin-open-telemetry to a Powerlines project.
documentType: getting-started
---

# Install @powerlines/plugin-open-telemetry

Registers OpenTelemetry tracing, metrics, and logging at runtime.

## Install the package

```sh
npm install @powerlines/plugin-open-telemetry
```

```sh
pnpm add @powerlines/plugin-open-telemetry
```

```sh
yarn add @powerlines/plugin-open-telemetry
```

## Peer dependencies

Install these alongside the plugin:

```sh
npm install @opentelemetry/api, @opentelemetry/sdk-trace-base, @opentelemetry/sdk-metrics, @opentelemetry/sdk-logs, exporters, and related packages
```

> [!NOTE]
> Powerlines packages are versioned independently. Pin the plugin version to match your `powerlines` core version.
