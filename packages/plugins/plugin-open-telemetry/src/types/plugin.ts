/* -------------------------------------------------------------------

                   ⚡ Storm Software - Powerlines

 This code was released as part of the Powerlines project. Powerlines
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/powerlines.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/powerlines
 Documentation:            https://docs.stormsoftware.com/projects/powerlines
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type {
  Attributes,
  ContextManager,
  TextMapGetter,
  TextMapPropagator
} from "@opentelemetry/api";
import type { Instrumentation } from "@opentelemetry/instrumentation";
import type { ResourceDetector } from "@opentelemetry/resources";
import type { LogRecordProcessor } from "@opentelemetry/sdk-logs";
import type { MetricReader, ViewOptions } from "@opentelemetry/sdk-metrics";
import type {
  IdGenerator,
  Sampler,
  SpanExporter,
  SpanLimits,
  SpanProcessor
} from "@opentelemetry/sdk-trace-base";
import type {
  AlloyPluginContext,
  AlloyPluginOptions,
  AlloyPluginResolvedConfig,
  AlloyPluginUserConfig
} from "@powerlines/plugin-alloy/types";
import type { AutoMDPluginOptions } from "@powerlines/plugin-automd/types/plugin";
import type {
  BabelPluginContext,
  BabelPluginResolvedConfig,
  BabelPluginUserConfig
} from "@powerlines/plugin-babel/types";
import type {
  EnvPluginContext,
  EnvPluginOptions,
  EnvPluginResolvedConfig,
  EnvPluginUserConfig
} from "@powerlines/plugin-env";

// ─── OTLP Exporter ────────────────────────────────────────────────────────────

/**
 * Configuration for the OTLP trace exporters.
 */
export interface OTLPExporterConfig {
  headers?: Record<string, unknown>;
  url?: string;
}

// ─── Union helpers (mirror @vercel/otel) ──────────────────────────────────────

export type PropagatorOrName =
  | TextMapPropagator
  | "auto"
  | "none"
  | "tracecontext"
  | "baggage";

export type SampleOrName =
  | Sampler
  | "auto"
  | "always_off"
  | "always_on"
  | "parentbased_always_off"
  | "parentbased_always_on"
  | "parentbased_traceidratio"
  | "traceidratio";

export type SpanProcessorOrName = SpanProcessor | "auto";

export type SpanExporterOrName = SpanExporter | "auto";

export type InstrumentationOptionOrName = Instrumentation | "fetch" | "auto";

// ─── Instrumentation configuration ────────────────────────────────────────────

export interface FetchInstrumentationConfig {
  /** URL matchers (string prefix or regex) to ignore from tracing. */
  ignoreUrls?: Array<string | RegExp>;
  /** URL matchers for which the tracing context should be propagated. */
  propagateContextUrls?: Array<string | RegExp>;
  /** URL matchers to exclude from context propagation. */
  dontPropagateContextUrls?: Array<string | RegExp>;
  /** Template string for the "resource.name" attribute. Use `{attr}` expressions. */
  resourceNameTemplate?: string;
}

export interface InstrumentationConfiguration {
  fetch?: FetchInstrumentationConfig;
}

// ─── Attributes from headers ───────────────────────────────────────────────────

export type AttributesFromHeaderFunc = <Carrier = unknown>(
  headers: Carrier,
  getter: TextMapGetter<Carrier>
) => Attributes | undefined;

export type AttributesFromHeaders =
  | Record<string, string>
  | AttributesFromHeaderFunc;

// ─── Main SDK Configuration (mirrors @vercel/otel's Configuration) ────────────

/**
 * OpenTelemetry SDK configuration. Mirrors the `@vercel/otel` `Configuration`
 * interface, allowing the same options to be passed to `registerOTel`.
 */
export interface Configuration {
  /**
   * The name of your service, used as the app name in many OpenTelemetry
   * backends. Can be overridden by the `OTEL_SERVICE_NAME` environment variable.
   */
  serviceName?: string;

  /**
   * Additional resource attributes to apply to all spans. By default the
   * plugin configures standard OpenTelemetry resource attributes such as
   * `deployment.environment.name`, `cloud.region`, `process.runtime.name`,
   * `vcs.ref.head.name`, `vcs.ref.head.revision`, `vcs.repository.name`,
   * and `deployment.id`.
   */
  attributes?: Attributes;

  /**
   * Compute root span attributes based on request headers.
   * A map with keys as attribute names and values as header names, or a
   * function that takes an opaque headers object and returns attributes.
   */
  attributesFromHeaders?: AttributesFromHeaders;

  /** Custom resource detectors. Defaults to `[envDetector]`. */
  resourceDetectors?: ResourceDetector[];

  /** Whether to auto-detect resources via detectors. Defaults to `true`. */
  autoDetectResources?: boolean;

  /**
   * Set of instrumentations to enable.
   * Defaults to `["auto"]` which enables the built-in fetch instrumentation.
   */
  instrumentations?: InstrumentationOptionOrName[];

  /**
   * Customize configuration for predefined instrumentations
   * (e.g. `fetch`).
   */
  instrumentationConfig?: InstrumentationConfiguration;

  /** Custom context manager. Defaults to `AsyncLocalStorageContextManager`. */
  contextManager?: ContextManager;

  /** Custom ID generator. Defaults to `RandomIdGenerator`. */
  idGenerator?: IdGenerator;

  /**
   * Propagators for extending inbound and outbound contexts.
   * Defaults to W3C Trace Context + Baggage propagators.
   * Can also be configured via `OTEL_PROPAGATORS` env var.
   */
  propagators?: PropagatorOrName[];

  /**
   * Sampler to decide which requests to trace.
   * Defaults to `"always_on"` (all requests).
   * Can also be configured via `OTEL_TRACES_SAMPLER` env var.
   */
  traceSampler?: SampleOrName;

  /**
   * Span processors to use. Defaults to `"auto"` which auto-configures the
   * best export mechanism for the environment.
   */
  spanProcessors?: SpanProcessorOrName[];

  /**
   * Custom trace exporter. Defaults to `"auto"` which selects the best
   * exporter for the environment (OTLP HTTP if `OTEL_EXPORTER_OTLP_ENDPOINT`
   * is set, etc.).
   */
  traceExporter?: SpanExporterOrName;

  /** Optional span limits configuration. */
  spanLimits?: SpanLimits;

  /** Log record processors to enable log recording. */
  logRecordProcessors?: LogRecordProcessor[];

  /** Metric readers for metrics collection. */
  metricReaders?: MetricReader[];

  /** Metric views for SDK-level metric filtering/aggregation. */
  views?: ViewOptions[];
}

// ─── Plugin options ────────────────────────────────────────────────────────────

export interface OpenTelemetryPluginOptions extends Configuration {
  /**
   * AutoMD configuration options to allow injecting OpenTelemetry documentation
   * into a markdown file such as a README.md.
   */
  automd?: AutoMDPluginOptions;

  /**
   * Alloy configuration options to use when generating OpenTelemetry runtime
   * code into the source tree.
   */
  alloy?: AlloyPluginOptions;

  /**
   * Env plugin options to use for configuring environment variable loading and injection, which can be used to configure the OpenTelemetry SDK via environment variables.
   */
  env?: EnvPluginOptions;
}

export type OpenTelemetryPluginUserConfig = BabelPluginUserConfig &
  AlloyPluginUserConfig &
  EnvPluginUserConfig & {
    openTelemetry: OpenTelemetryPluginOptions;
  };

export type OpenTelemetryPluginResolvedConfig = BabelPluginResolvedConfig &
  AlloyPluginResolvedConfig &
  EnvPluginResolvedConfig & {
    openTelemetry: OpenTelemetryPluginOptions;
  };

export interface OpenTelemetryPluginContext<
  TResolvedConfig extends OpenTelemetryPluginResolvedConfig =
    OpenTelemetryPluginResolvedConfig
>
  extends
    BabelPluginContext<TResolvedConfig>,
    AlloyPluginContext<TResolvedConfig>,
    EnvPluginContext<TResolvedConfig> {}
