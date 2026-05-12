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
  FrameworkOptions,
  InlineConfig,
  LogFn,
  LoggerOptions,
  LogLevelResolvedConfig
} from "@powerlines/core";
import { PowerlinesBaseContext } from "@powerlines/core/context/base-context";
import {
  getDefaultLogLevel,
  loadParsedConfig,
  resolveRoot
} from "@powerlines/core/lib/config";
import {
  createLogger,
  formatConfig,
  resolveLogLevel,
  withCustomLogger
} from "@powerlines/core/plugin-utils";
import { toArray } from "@stryke/convert/to-array";
import { EnvPaths, getEnvPaths } from "@stryke/env/get-env-paths";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { uuid } from "@stryke/unique-id/uuid";
import { createHostContext } from "devframe/node";
import {
  ConnectionMeta,
  DevToolsHost,
  DevToolsNodeContext
} from "devframe/types";
import * as v from "valibot";
import { EngineOptions } from "../types/config";
import { EngineContext, EngineExecutionItem } from "../types/context";

export class PowerlinesEngineContext<TSystemContext = unknown>
  extends PowerlinesBaseContext<TSystemContext>
  implements EngineContext<TSystemContext>
{
  #executions: EngineExecutionItem[] = [];

  #devtools!: DevToolsNodeContext;

  #logLevel!: LogLevelResolvedConfig;

  /**
   * Creates a new instance of the PowerlinesEngineContext class.
   *
   * @param options - The options to initialize the context with.
   * @returns A promise that resolves to an instance of the PowerlinesEngineContext class.
   */
  public static async from<TSystemContext = unknown>(
    options: EngineOptions,
    host: DevToolsHost,
    connection: ConnectionMeta
  ): Promise<PowerlinesEngineContext<TSystemContext>> {
    const context = new PowerlinesEngineContext<TSystemContext>(
      options,
      connection
    );

    context.#devtools = await createHostContext({
      cwd: context.cwd,
      mode: "dev",
      host
    });
    await options.setup?.(context.#devtools);

    context.#devtools.rpc.register({
      name: "powerlines:log",
      type: "event",
      args: [
        v.object({
          meta: v.object({
            category: v.string(),
            name: v.string(),
            command: v.string(),
            hook: v.string(),
            plugin: v.string(),
            source: v.string()
          }),
          message: v.string()
        })
      ],
      setup: _ => ({
        handler: payload => {
          switch (payload.meta.type) {
            case "error":
              context.error(payload);
              break;
            case "warn":
              context.warn(payload);
              break;
            case "info":
              context.info(payload);
              break;
            case "debug":
              context.debug(payload);
              break;
            case "trace":
              context.trace(payload);
              break;
            default:
              context.info(payload);
              break;
          }
        }
      })
    });

    context.#logLevel = options.logLevel
      ? resolveLogLevel(options.logLevel)
      : await getDefaultLogLevel(context.cwd);

    return context;
  }

  public override createLogger(options: LoggerOptions = {}, logFn?: LogFn) {
    let logger = createLogger(
      "engine",
      {
        logLevel: this.#logLevel,
        ...options
      },
      logFn
    );
    if (this.options.customLogger) {
      logger = withCustomLogger(logger, this.options.customLogger);
    }
    return logger;
  }

  public get executions(): EngineExecutionItem[] {
    return this.#executions;
  }

  public get devtools(): DevToolsNodeContext {
    return this.#devtools;
  }

  public get envPaths(): EnvPaths {
    return getEnvPaths({
      orgId: kebabCase(this.orgId),
      appId: kebabCase(this.framework.name),
      workspaceRoot: this.cwd
    });
  }

  public get framework(): FrameworkOptions {
    return {
      name: "powerlines",
      orgId: "storm-software",
      ...this.options.framework
    };
  }

  public get orgId(): string {
    return this.framework.orgId;
  }

  /**
   * Creates a new Context instance.
   *
   * @param options - The options to use for creating the context, including the resolved configuration and workspace settings.
   * @param connection - The connection metadata for the dev server.
   */
  protected constructor(
    public override options: EngineOptions,
    public connection: ConnectionMeta
  ) {
    super(options);
  }

  /**
   * Initialize the context with the provided configuration options
   *
   * @remarks
   * This method will set up the resolver and load the user configuration file based on the provided options. It is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup.
   *
   * @param method - The path to the execution configuration to load and run, which can be used to specify different execution configurations for different commands or scenarios.
   * @param inlineConfig - Additional configuration options provided at runtime, which can override or supplement the options defined in the user configuration file.
   */
  public async loadExecutions(
    method: string,
    inlineConfig: InlineConfig
  ): Promise<EngineExecutionItem[]> {
    const root = resolveRoot(
      this.cwd,
      inlineConfig.root,
      inlineConfig.configFile
    );

    const config = await loadParsedConfig(
      this.cwd,
      root,
      this.framework?.name,
      this.orgId,
      inlineConfig
    );
    if (!config) {
      throw new Error("Failed to load configuration");
    }

    const invocationId = uuid();
    const executions = await Promise.all(
      toArray(config.config).map(async (_, configIndex) => {
        const executionId = uuid();
        const options = {
          cwd: this.cwd,
          root,
          framework: this.framework,
          orgId: this.orgId,
          ...this.options,
          command: method,
          baseURL: this.#devtools.host.resolveOrigin(),
          connection: this.connection,
          configFile: config.configFile!,
          executionId,
          configIndex
        };

        this.logger.debug({
          meta: { category: "config" },
          message: `Invoking ${method} with the following execution parameters: \n --- Options --- \n${formatConfig(
            options
          )}\n --- Inline Config --- \n${formatConfig(inlineConfig)}`
        });

        return {
          invocationId,
          method,
          configFile: config,
          options,
          state: {
            command: null,
            hook: null,
            plugin: null
          }
        };
      })
    );

    this.#executions = this.#executions.concat(executions);

    return executions;
  }

  /**
   * Complete an execution by removing it from the list of active executions based on the provided invocation ID and execution ID. This method is typically called when an execution has finished or has been terminated, allowing the context to clean up any resources associated with that execution and update its internal state accordingly.
   *
   * @param invocationId - The unique identifier for the invocation of the execution to be completed.
   * @param executionId - The unique identifier for the specific execution to be completed.
   */
  public completeExecution(invocationId: string, executionId: string) {
    this.#executions = this.#executions.filter(
      execution =>
        execution.options.executionId !== executionId ||
        execution.invocationId !== invocationId
    );
  }
}
