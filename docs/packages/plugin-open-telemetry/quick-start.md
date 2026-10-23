---
title: Quick start with @powerlines/plugin-open-telemetry
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-open-telemetry

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as openTelemetry } from "@powerlines/plugin-open-telemetry";

export default defineConfig({
  plugins: [openTelemetry()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as openTelemetry } from "@powerlines/plugin-open-telemetry";

export default defineConfig({
  plugins: [openTelemetry({ serviceName: "my-service" })],
  openTelemetry: { serviceName: "my-service" }
});
```

## Expected result

Telemetry is initialized with the given service name. Spans and metrics export through the configured exporter.
