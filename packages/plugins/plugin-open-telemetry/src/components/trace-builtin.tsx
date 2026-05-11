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

import { code, Show, splitProps } from "@alloy-js/core";
import { FunctionDeclaration } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import {
  BuiltinFile,
  BuiltinFileProps
} from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocParam
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import defu from "defu";
import { OpenTelemetryPluginContext } from "../types";

export type TraceBuiltinProps = Omit<BuiltinFileProps, "id">;

/**
 * Generates the trace module for the Powerlines project.
 */
export function TraceBuiltin(props: TraceBuiltinProps) {
  const [{ children, imports }, rest] = splitProps(props, [
    "children",
    "imports"
  ]);

  const context = usePowerlines<OpenTelemetryPluginContext>();

  return (
    <BuiltinFile
      id="trace"
      description="The runtime OpenTelemetry trace module provides registerOTel and getTracer helpers that mirror the @vercel/otel API."
      {...rest}
      imports={defu(
        {
          "@opentelemetry/api": [
            { name: "trace" },
            { name: "diag" },
            { name: "propagation" },
            { name: "context" },
            { name: "metrics" },
            { name: "DiagConsoleLogger" },
            { name: "DiagLogLevel" },
            { name: "ContextManager", type: true },
            { name: "TextMapPropagator", type: true },
            { name: "Attributes", type: true }
          ],
          "@opentelemetry/api-logs": [{ name: "logs" }],
          "@opentelemetry/context-async-hooks": [
            { name: "AsyncLocalStorageContextManager" }
          ],
          "@opentelemetry/core": [
            { name: "CompositePropagator" },
            { name: "ExportResult", type: true },
            { name: "W3CBaggagePropagator" },
            { name: "W3CTraceContextPropagator" },
            { name: "parseKeyPairsIntoRecord" }
          ],
          "@opentelemetry/instrumentation": [
            { name: "registerInstrumentations" },
            { name: "Instrumentation", type: true }
          ],
          "@opentelemetry/resources": [
            { name: "resourceFromAttributes" },
            { name: "detectResources" },
            { name: "envDetector" }
          ],
          "@opentelemetry/sdk-logs": [{ name: "LoggerProvider" }],
          "@opentelemetry/sdk-metrics": [{ name: "MeterProvider" }],
          "@opentelemetry/sdk-trace-base": [
            { name: "BasicTracerProvider" },
            { name: "BatchSpanProcessor" },
            { name: "RandomIdGenerator" },
            { name: "AlwaysOnSampler" },
            { name: "AlwaysOffSampler" },
            { name: "ParentBasedSampler" },
            { name: "TraceIdRatioBasedSampler" },
            { name: "ReadableSpan", type: true },
            { name: "Sampler", type: true },
            { name: "SpanExporter", type: true },
            { name: "SpanProcessor", type: true }
          ],
          "@powerlines/plugin-open-telemetry": [
            { name: "Configuration", type: true }
          ],
          "@opentelemetry/exporter-trace-otlp-http": [
            { name: "OTLPTraceExporter" }
          ]
        },
        imports ?? {}
      )}
      builtinImports={{
        env: ["env"]
      }}>
      <TSDoc heading="Configuration for the OTLP HTTP trace exporters.">
        <TSDocParam name="url">
          {`The URL of the OTLP collector endpoint. Defaults to http://localhost:4318/v1/traces.`}
        </TSDocParam>
        <TSDocParam name="headers">
          {`Additional HTTP headers to send with each export request.`}
        </TSDocParam>
      </TSDoc>
      <Spacing />
      <TSDoc heading="OTLP trace exporter using the `http/json` protocol. Compatible with the Edge runtime. Mirrors `OTLPHttpJsonTraceExporter` from `@vercel/otel`.">
        <TSDocParam name="config">
          {`Optional exporter configuration (url, headers).`}
        </TSDocParam>
      </TSDoc>
      {code`
export class OTLPHttpJsonTraceExporter implements SpanExporter {
  private readonly impl: OTLPTraceExporter;

  constructor(config: OTLPExporterConfig = {}) {
    this.impl = new OTLPTraceExporter({
      url: config.url ?? (env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ?? "http://localhost:4318/v1/traces"),
      headers: (config.headers as Record<string, string>) ?? {},
    });
  }

  export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
    this.impl.export(spans, resultCallback);
  }

  shutdown(): Promise<void> {
    return this.impl.shutdown();
  }

  forceFlush(): Promise<void> {
    return this.impl.forceFlush?.() ?? Promise.resolve();
  }
}`}
      <Spacing />
      <TSDoc heading="OTLP trace exporter using the `http/protobuf` protocol. Compatible with the Edge runtime. Mirrors `OTLPHttpProtoTraceExporter` from `@vercel/otel`.">
        <TSDocParam name="config">
          {`Optional exporter configuration (url, headers). The OTLP collector must support the protobuf encoding.`}
        </TSDocParam>
      </TSDoc>
      {code`
export class OTLPHttpProtoTraceExporter implements SpanExporter {
  private readonly impl: OTLPTraceExporter;

  constructor(config: OTLPExporterConfig = {}) {
    this.impl = new OTLPTraceExporter({
      url: config.url ?? env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
      headers: {
        "Content-Type": "application/x-protobuf",
        ...((config.headers as Record<string, string>) ?? {}),
      },
    });
  }

  export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
    this.impl.export(spans, resultCallback);
  }

  shutdown(): Promise<void> {
    return this.impl.shutdown();
  }

  forceFlush(): Promise<void> {
    return this.impl.forceFlush?.() ?? Promise.resolve();
  }
}`}
      <Spacing />

      <TSDoc heading="OpenTelemetry SDK configuration. Mirrors the `@vercel/otel` `Configuration` interface.">
        <TSDocParam name="serviceName">
          {`The name of your service. Can be overridden by the OTEL_SERVICE_NAME environment variable.`}
        </TSDocParam>
        <TSDocParam name="attributes">
          {`Additional resource attributes to apply to all spans.`}
        </TSDocParam>
        <TSDocParam name="propagators">
          {`Propagators for extending inbound and outbound contexts. Defaults to W3C Trace Context + Baggage.`}
        </TSDocParam>
        <TSDocParam name="traceSampler">
          {`Sampler to decide which requests to trace. Defaults to "always_on".`}
        </TSDocParam>
        <TSDocParam name="spanProcessors">
          {`Span processors to use. Defaults to "auto" which auto-configures based on environment variables.`}
        </TSDocParam>
        <TSDocParam name="traceExporter">
          {`Custom trace exporter. Defaults to "auto" which selects the best exporter for the environment.`}
        </TSDocParam>
      </TSDoc>
      <TSDoc heading="Registers the OpenTelemetry SDK with the specified service name or configuration object. Should be called in `instrumentation.ts` before any other code.">
        <TSDocParam name="optionsOrServiceName">
          {`Either a service name string or a full Configuration object.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        name="registerOTel"
        export
        parameters={[
          {
            name: "optionsOrServiceName?",
            type: "Configuration | string"
          }
        ]}
        returnType="void">
        {code`
  let options: Configuration;
  if (!optionsOrServiceName) {
    options = {};
  } else if (typeof optionsOrServiceName === "string") {
    options = { serviceName: optionsOrServiceName };
  } else {
    options = optionsOrServiceName;
  }

  if (env.OTEL_SDK_DISABLED) {
    return;
  }

  // Optional diagnostic logging via OTEL_LOG_LEVEL.
  if (env.OTEL_LOG_LEVEL || env.LOG_LEVEL !== undefined) {
    const logLevelMap: Record<string, DiagLogLevel> = {
      ALL: DiagLogLevel.ALL,
      VERBOSE: DiagLogLevel.VERBOSE,
      DEBUG: DiagLogLevel.DEBUG,
      INFO: DiagLogLevel.INFO,
      WARN: DiagLogLevel.WARN,
      ERROR: DiagLogLevel.ERROR,
      NONE: DiagLogLevel.NONE,
    };

    let level: DiagLogLevel | undefined = undefined;
    if (env.OTEL_LOG_LEVEL) {
      level = logLevelMap[env.OTEL_LOG_LEVEL.toUpperCase()];
    } else if (env.LOG_LEVEL !== undefined) {
      level = env.LOG_LEVEL === null ? DiagLogLevel.NONE : logLevelMap[env.LOG_LEVEL.toUpperCase()];
    }

    if (level !== undefined) {
      diag.setLogger(new DiagConsoleLogger(), { logLevel: level });
    }
  }

  const idGenerator = options.idGenerator ?? new RandomIdGenerator();
  const serviceName = env.OTEL_SERVICE_NAME || options.serviceName || "${context.config.name}";

  const contextManager: ContextManager =
    options.contextManager ?? new AsyncLocalStorageContextManager();
  contextManager.enable();
  context.setGlobalContextManager(contextManager);

  let resource = resourceFromAttributes({
    "service.name": serviceName,
    "process.runtime.name": env.RUNTIME,
    ...(options.attributes ?? {}),
  });

  const autoDetectResources = options.autoDetectResources ?? true;
  if (autoDetectResources) {
    const detectedResource = detectResources({
      detectors: options.resourceDetectors ?? [envDetector],
    });
    resource = resource.merge(detectedResource);
  }

  const envPropagators = process.env.OTEL_PROPAGATORS
    ? process.env.OTEL_PROPAGATORS.split(",").map((s) => s.trim())
    : undefined;
  const propagatorArgs: Array<TextMapPropagator | string> =
    options.propagators ?? envPropagators ?? ["auto"];
  const resolvedPropagators: TextMapPropagator[] = propagatorArgs
    .flatMap((p) => {
      if (p === "none") return [];
      if (p === "auto" || p === "tracecontext") {
        const list: TextMapPropagator[] = [new W3CTraceContextPropagator()];
        if (p === "auto") list.push(new W3CBaggagePropagator());
        return list;
      }
      if (p === "baggage") return [new W3CBaggagePropagator()];
      if (typeof p !== "string") return [p as TextMapPropagator];
      throw new Error(\`@powerlines/plugin-open-telemetry: Unknown propagator "\${p}"\`);
    });
  propagation.setGlobalPropagator(
    new CompositePropagator({ propagators: resolvedPropagators })
  );

  const samplerName = !options.traceSampler || options.traceSampler === "auto"
    ? env.OTEL_TRACES_SAMPLER
    : typeof options.traceSampler === "string"
      ? options.traceSampler
      : undefined;

  let sampler: Sampler;
  if (options.traceSampler && typeof options.traceSampler !== "string") {
    sampler = options.traceSampler as Sampler;
  } else {
    const probability = isNaN(env.OTEL_TRACES_SAMPLER_ARG) || env.OTEL_TRACES_SAMPLER_ARG < 0 || env.OTEL_TRACES_SAMPLER_ARG > 1 ? 1 : env.OTEL_TRACES_SAMPLER_ARG;
    switch (samplerName) {
      case "always_off":
        sampler = new AlwaysOffSampler();
        break;
      case "parentbased_always_on":
        sampler = new ParentBasedSampler({ root: new AlwaysOnSampler() });
        break;
      case "parentbased_always_off":
        sampler = new ParentBasedSampler({ root: new AlwaysOffSampler() });
        break;
      case "traceidratio":
        sampler = new TraceIdRatioBasedSampler(probability);
        break;
      case "parentbased_traceidratio":
        sampler = new ParentBasedSampler({
          root: new TraceIdRatioBasedSampler(probability),
        });
        break;
      case "always_on":
      default:
        sampler = new AlwaysOnSampler();
    }
  }

  const spanProcessors: SpanProcessor[] = (options.spanProcessors ?? ["auto"]).flatMap((sp) => {
    if (sp !== "auto") {
      return [sp as SpanProcessor];
    }

    const processors: SpanProcessor[] = [];
    if (
      !options.traceExporter ||
      options.traceExporter === "auto" ||
      env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
    ) {
      // Dynamic import keeps the exporter optional at runtime.
      diag.debug(
        "@powerlines/plugin-open-telemetry: Auto-configuring OTLP trace exporter",
        env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
      );
    }
    return processors;
  });

  // If a custom traceExporter was provided, wrap it in a BatchSpanProcessor.
  if (options.traceExporter && options.traceExporter !== "auto") {
    spanProcessors.push(
      new BatchSpanProcessor(options.traceExporter as SpanExporter)
    );
  }

  const tracerProvider = new BasicTracerProvider({
    resource,
    idGenerator,
    sampler,
    spanLimits: options.spanLimits,
    spanProcessors,
  });
  trace.setGlobalTracerProvider(tracerProvider);

  if (options.logRecordProcessors) {
    const loggerProvider = new LoggerProvider({
      resource,
      processors: options.logRecordProcessors,
    });
    logs.setGlobalLoggerProvider(loggerProvider);
  }

  if (options.metricReaders || options.views) {
    const meterProvider = new MeterProvider({
      resource,
      views: options.views ?? [],
      readers: options.metricReaders ?? [],
    });
    metrics.setGlobalMeterProvider(meterProvider);
  }

  const instrumentationArgs: Array<Instrumentation | string> = options.instrumentations ?? ["auto"];
  const instrumentations: Instrumentation[] = instrumentationArgs.flatMap(
    (inst) => {
      if (typeof inst !== "string") {
        return [inst as Instrumentation];
      }

      // "auto" and "fetch" are resolved by the consumer via their own imports.
      return [];
    }
  );
  registerInstrumentations({ instrumentations });

  diag.info("@powerlines/plugin-open-telemetry: started", serviceName, env.RUNTIME);`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="Returns a named tracer from the global OpenTelemetry TracerProvider. Wraps `trace.getTracer()` for convenience.">
        <TSDocParam name="name">
          {`The name of the tracer (typically the instrumentation library name or component name).`}
        </TSDocParam>
        <TSDocParam name="version">
          {`Optional version of the instrumentation library.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        name="getTracer"
        export
        parameters={[
          { name: "name", type: "string" },
          { name: "version", type: "string", optional: true }
        ]}
        returnType="ReturnType<typeof trace.getTracer>">
        {code`return trace.getTracer(name, version);`}
      </FunctionDeclaration>
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
