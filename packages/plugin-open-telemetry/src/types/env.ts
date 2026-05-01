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

import { EnvInterface } from "@powerlines/plugin-env/types/env";

/**
 * The base environment configuration used by Powerlines applications
 *
 * @remarks
 * This interface is used to define the environment variables, configuration options, and runtime settings used by applications. It is used to provide type safety, autocompletion, and default values for the environment variables. The comments of each variable are used to provide documentation descriptions when running the \`powerlines docs\` command.
 *
 * @categoryDescription Platform
 * The name of the platform the configuration parameter is intended for use in.
 *
 * @showCategories
 */
export interface OpenTelemetryEnv extends EnvInterface {
  /**
   * The name of the service. If none if provided, the plugin will attempt to use the value of the {@link EnvInterface.APP_NAME} configuration option.
   */
  readonly OTEL_SERVICE_NAME?: string;

  /**
   * The OTLP traces endpoint URL.
   *
   * @defaultValue "http://localhost:4318/v1/traces"
   */
  readonly OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: string;

  /**
   * The supported trace sampler to use.
   *
   * @defaultValue "always_on"
   */
  readonly OTEL_TRACES_SAMPLER:
    | "always_on"
    | "always_off"
    | "traceidratio"
    | "parentbased_traceidratio";

  /**
   * The argument for the trace sampler. For example, if using the "traceidratio" sampler, this would be a number between 0 and 1 representing the sampling ratio.
   *
   * @defaultValue 1
   */
  readonly OTEL_TRACES_SAMPLER_ARG: number;

  /**
   * A comma-separated list of trace exporter types to use. Supported values include "http" and "console".
   *
   * @defaultValue "http"
   */
  readonly OTEL_EXPORTER_TYPES?: string;

  /**
   * A comma-separated list of trace propagator types to use. Supported values include "tracecontext" and "baggage".
   *
   * @defaultValue "tracecontext,baggage"
   */
  readonly OTEL_PROPAGATORS?: string;

  /**
   * A comma-separated list of trace instrumentations to use. Supported values include "http", "express", and "graphql".
   *
   * @defaultValue "http,express"
   */
  readonly OTEL_INSTRUMENTATIONS?: string;

  /**
   * The log level for OpenTelemetry SDK diagnostics. If not set, the {@link EnvInterface.LOG_LEVEL} variable will be used to determine the log level for diagnostics.
   *
   * @defaultValue "INFO"
   */
  readonly OTEL_LOG_LEVEL?:
    | "ALL"
    | "VERBOSE"
    | "DEBUG"
    | "INFO"
    | "WARN"
    | "ERROR"
    | "NONE";

  /**
   * A boolean flag to disable the OpenTelemetry SDK. When set to "true", the plugin will not inject any OpenTelemetry code or configuration into the application.
   *
   * @defaultValue false
   */
  readonly OTEL_SDK_DISABLED: boolean;

  /**
   * The runtime that the application is running in.
   *
   * @defaultValue "nodejs"
   */
  RUNTIME: "nodejs" | "deno" | "workerd" | "browser";
}
