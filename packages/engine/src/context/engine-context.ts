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
  EngineContext,
  EngineOptions,
  ExecutionState,
  LogLevelResolvedConfig,
  UserConfig
} from "@powerlines/core";
import { toArray } from "@stryke/convert/to-array";
import { DeepPartial, RequiredKeys } from "@stryke/types/base";
import { uuid } from "@stryke/unique-id/uuid";
import { PowerlinesBaseContext } from "./base-context";

export class PowerlinesEngineContext
  extends PowerlinesBaseContext
  implements EngineContext
{
  #executions: ExecutionState[] = [];

  /**
   * Creates a new instance of the PowerlinesEngineContext class.
   *
   * @param options - The options to initialize the context with.
   * @returns A promise that resolves to an instance of the PowerlinesEngineContext class.
   */
  public static async fromInitialConfig(
    options: EngineOptions,
    initialConfig: DeepPartial<UserConfig> = {}
  ): Promise<PowerlinesEngineContext> {
    const context = new PowerlinesEngineContext(options, initialConfig);
    await context.init();

    return context;
  }

  /**
   * The initial options provided to the Powerlines process before any resolution or merging. This is typically the user configuration provided in the Powerlines configuration file, but may also include additional configuration options provided by plugins or other sources.
   */
  public override readonly initialOptions: EngineOptions;

  /**
   * The initial user configuration provided to the Powerlines process before any resolution or merging. This is typically the user configuration provided in the Powerlines configuration file, but may also include additional configuration options provided by plugins or other sources.
   */
  public override readonly initialConfig: DeepPartial<UserConfig>;

  /**
   * The options provided to the Powerlines process
   */
  public override options: RequiredKeys<
    Omit<EngineOptions, "logLevel">,
    "name" | "root" | "cwd" | "mode" | "framework"
  > & {
    /**
     * The log level to use for logging messages during the build process. This can be a string indicating the log level or a more detailed configuration object that allows for specifying different log levels for different categories of logs.
     */
    logLevel: LogLevelResolvedConfig;
  } = {} as RequiredKeys<
    Omit<EngineOptions, "logLevel">,
    "name" | "root" | "cwd" | "mode" | "framework"
  > & {
    /**
     * The log level to use for logging messages during the build process. This can be a string indicating the log level or a more detailed configuration object that allows for specifying different log levels for different categories of logs.
     */
    logLevel: LogLevelResolvedConfig;
  };

  /**
   * Creates a new Context instance.
   *
   * @param options - The options to use for creating the context, including the resolved configuration and workspace settings.
   * @param initialConfig - The initial configuration provided by the user, which can be used to resolve the final configuration for the context. This typically includes the user configuration options defined in the `powerlines.config.ts` file, as well as any inline configuration options provided during execution.
   */
  protected constructor(
    options: EngineOptions,
    initialConfig: DeepPartial<UserConfig> = {}
  ) {
    super(options, initialConfig);
    this.initialOptions = options;
    this.initialConfig = initialConfig;
  }

  /**
   * Initialize the context with the provided configuration options
   *
   * @remarks
   * This method will set up the resolver and load the user configuration file based on the provided options. It is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup.
   */
  protected override async init() {
    await super.init();

    if (!this.configFile?.config) {
      this.fatal(
        "No configuration file found. Please ensure you have a valid configuration file in your project."
      );
      throw new Error("No configuration file found");
    }

    this.#executions = await Promise.all(
      toArray(this.configFile.config).map(async (_, executionIndex) => {
        const executionId = uuid();

        return {
          executionId,
          options: {
            cwd: this.options.cwd,
            root: this.options.root,
            configFile: this.options.configFile,
            ...this.initialOptions,
            executionId,
            executionIndex
          },
          active: {
            command: null,
            hook: null,
            plugin: null
          }
        };
      })
    );
  }

  /**
   * A list of all command executions that will be run during the lifecycle of the engine
   *
   * @returns An array of {@link ExecutionState} representing each execution context for the engine.
   */
  public get executions(): ExecutionState[] {
    return this.#executions;
  }
}
