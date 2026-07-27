/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import { envSchema, RuntimeSchema } from "@powerlines/plugin-env/schemas/env";
import * as z from "zod";

/**
 * Supported OpenTelemetry trace samplers.
 */
export const OtelTracesSamplerSchema = z.enum([
  "always_on",
  "always_off",
  "traceidratio",
  "parentbased_traceidratio"
]);
export type OtelTracesSampler = z.infer<typeof OtelTracesSamplerSchema>;

/**
 * OpenTelemetry SDK diagnostic log levels.
 */
export const OtelLogLevelSchema = z.enum([
  "ALL",
  "VERBOSE",
  "DEBUG",
  "INFO",
  "WARN",
  "ERROR",
  "NONE"
]);
export type OtelLogLevel = z.infer<typeof OtelLogLevelSchema>;

/**
 * Zod schema for OpenTelemetry plugin environment variables.
 *
 * @remarks
 * Extends the base Powerlines {@link envSchema} with OTEL-specific configuration.
 */
export const openTelemetryEnvSchema = envSchema
  .extend({
    OTEL_SERVICE_NAME: z.string().optional().meta({
      description:
        "The name of the service. If none if provided, the plugin will attempt to use the value of the APP_NAME configuration option.",
      readonly: true
    }),
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: z
      .string()
      .default("http://localhost:4318/v1/traces")
      .meta({
        description: "The OTLP traces endpoint URL.",
        defaultValue: "http://localhost:4318/v1/traces",
        readonly: true
      }),
    OTEL_TRACES_SAMPLER: OtelTracesSamplerSchema.default("always_on").meta({
      description: "The supported trace sampler to use.",
      defaultValue: "always_on",
      readonly: true
    }),
    OTEL_TRACES_SAMPLER_ARG: z.number().default(1).meta({
      description:
        'The argument for the trace sampler. For example, if using the "traceidratio" sampler, this would be a number between 0 and 1 representing the sampling ratio.',
      defaultValue: 1,
      readonly: true
    }),
    OTEL_EXPORTER_TYPES: z.string().default("http").meta({
      description:
        'A comma-separated list of trace exporter types to use. Supported values include "http" and "console".',
      defaultValue: "http",
      readonly: true
    }),
    OTEL_PROPAGATORS: z.string().default("tracecontext,baggage").meta({
      description:
        'A comma-separated list of trace propagator types to use. Supported values include "tracecontext" and "baggage".',
      defaultValue: "tracecontext,baggage",
      readonly: true
    }),
    OTEL_INSTRUMENTATIONS: z.string().default("http,express").meta({
      description:
        'A comma-separated list of trace instrumentations to use. Supported values include "http", "express", and "graphql".',
      defaultValue: "http,express",
      readonly: true
    }),
    OTEL_LOG_LEVEL: OtelLogLevelSchema.default("INFO").meta({
      description:
        "The log level for OpenTelemetry SDK diagnostics. If not set, the LOG_LEVEL variable will be used to determine the log level for diagnostics.",
      defaultValue: "INFO",
      readonly: true
    }),
    OTEL_SDK_DISABLED: z.boolean().default(false).meta({
      description:
        'A boolean flag to disable the OpenTelemetry SDK. When set to "true", the plugin will not inject any OpenTelemetry code or configuration into the application.',
      defaultValue: false,
      readonly: true
    }),
    RUNTIME: RuntimeSchema.default("nodejs").meta({
      description: "The runtime that the application is running in.",
      defaultValue: "nodejs"
    })
  })
  .meta({
    description:
      "The base environment configuration used by Powerlines applications with OpenTelemetry. This schema defines the environment variables, configuration options, and runtime settings used by applications."
  });

/**
 * Inferred OpenTelemetry environment configuration type from {@link openTelemetryEnvSchema}.
 */
export type OpenTelemetryEnv = z.infer<typeof openTelemetryEnvSchema>;
