---
title: Configure @powerlines/plugin-open-telemetry
description: Options for the openTelemetry config block.
documentType: concept
---

# Configure @powerlines/plugin-open-telemetry

Set options on the `openTelemetry` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  openTelemetry: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `serviceName` | `string` | — |
| `attributes` | `Attributes` | — |
| `attributesFromHeaders` | `AttributesFromHeaders` | — |
| `resourceDetectors` | `ResourceDetector[]` | — |
| `autoDetectResources` | `boolean` | — |
| `instrumentations` | `InstrumentationOptionOrName[]` | — |
| `instrumentationConfig` | `InstrumentationConfiguration` | — |
| `contextManager` | `ContextManager` | — |
| `idGenerator` | `IdGenerator` | — |
| `propagators` | `PropagatorOrName[]` | — |
| `traceSampler` | `SampleOrName` | — |
| `spanProcessors` | `SpanProcessorOrName[]` | — |
| `traceExporter` | `SpanExporterOrName` | — |
| `spanLimits` | `SpanLimits` | — |
| `logRecordProcessors` | `LogRecordProcessor[]` | — |
| `metricReaders` | `MetricReader[]` | — |
| `views` | `ViewOptions[]` | — |
| `ignoreUrls` | `Array<string \| RegExp>` | — |
| `propagateContextUrls` | `Array<string \| RegExp>` | — |
| `dontPropagateContextUrls` | `Array<string \| RegExp>` | — |
| `resourceNameTemplate` | `string` | — |
| `automd` | `AutoMDPluginOptions` | — |
| `alloy` | `AlloyPluginOptions` | — |
| `env` | `EnvPluginOptions` | — |

`OpenTelemetryPluginOptions` extends the OpenTelemetry SDK `Configuration` type, so SDK fields beyond this table may also apply. Types for exporters, samplers, and propagators come from the `@opentelemetry/*` packages. No defaults are stated in the plugin source.
