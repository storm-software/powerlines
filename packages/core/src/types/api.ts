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

import { SUPPORTED_COMMANDS } from "../constants";
import { BASE_API_FUNCTIONS, POWERLINES_API_FUNCTIONS } from "../constants/api";
import {
  BuildInlineConfig,
  CleanInlineConfig,
  DeployInlineConfig,
  DocsInlineConfig,
  ExecutionOptions,
  InitialConfig,
  InlineConfig,
  LintInlineConfig,
  NewInlineConfig,
  PrepareInlineConfig,
  ResolvedConfig,
  TestInlineConfig,
  TypesInlineConfig
} from "./config";
import type {
  EnvironmentContext,
  ExecutionContext,
  PluginContext
} from "./context";
import { EngineContext } from "./context";
import {
  CallHookOptions,
  InferHookParameters,
  InferHookReturnType
} from "./hooks";
import { WorkerProcess } from "./utils";

export type BaseAPIFunctions = (typeof BASE_API_FUNCTIONS)[number];
export type APIFunctions = (typeof POWERLINES_API_FUNCTIONS)[number];
export type SupportedCommands = (typeof SUPPORTED_COMMANDS)[number];

/**
 * The Powerlines Base API Interface
 *
 * @remarks
 * This interface defines the base API for Powerlines, which includes the shared context and the core commands. It is extended by the ExecutionAPI and EngineAPI interfaces to provide additional functionality specific to their respective contexts.
 */
export interface Execution {
  /**
   * Prepare the Powerlines API
   *
   * @remarks
   * This method will prepare the Powerlines API for use, initializing any necessary resources.
   *
   * @param inlineConfig - The inline configuration for the prepare command
   */
  prepare: (
    inlineConfig:
      | PrepareInlineConfig
      | NewInlineConfig
      | CleanInlineConfig
      | BuildInlineConfig
      | LintInlineConfig
      | DocsInlineConfig
      | DeployInlineConfig
  ) => Promise<void>;

  /**
   * Generate the Powerlines typescript declaration file
   *
   * @remarks
   * This method will only generate the typescript declaration file for the Powerlines project. It is generally recommended to run the full `prepare` command, which will run this method as part of its process.
   *
   * @param inlineConfig - The inline configuration for the types command
   */
  types: (inlineConfig: TypesInlineConfig) => Promise<void>;

  /**
   * Create a new Powerlines project
   *
   * @remarks
   * This method will create a new Powerlines project in the current directory.
   *
   * @param inlineConfig - The inline configuration for the new command
   * @returns A promise that resolves when the project has been created
   */
  new: (inlineConfig: NewInlineConfig) => Promise<void>;

  /**
   * Clean any previously prepared artifacts
   *
   * @remarks
   * This method will remove the previous Powerlines artifacts from the project.
   *
   * @param inlineConfig - The inline configuration for the clean command
   * @returns A promise that resolves when the clean command has completed
   */
  clean: (
    inlineConfig: CleanInlineConfig | PrepareInlineConfig
  ) => Promise<void>;

  /**
   * Lint the project source code
   *
   * @param inlineConfig - The inline configuration for the lint command
   * @returns A promise that resolves when the lint command has completed
   */
  lint: (inlineConfig: LintInlineConfig) => Promise<void>;

  /**
   * Test the project source code
   *
   * @param inlineConfig - The inline configuration for the test command
   * @returns A promise that resolves when the test command has completed
   */
  test: (inlineConfig: TestInlineConfig) => Promise<void>;

  /**
   * Build the project
   *
   * @remarks
   * This method will build the Powerlines project, generating the necessary artifacts.
   *
   * @param inlineConfig - The inline configuration for the build command
   * @returns A promise that resolves when the build command has completed
   */
  build: (inlineConfig: BuildInlineConfig) => Promise<void>;

  /**
   * Prepare the documentation for the project
   *
   * @param inlineConfig - The inline configuration for the docs command
   * @returns A promise that resolves when the documentation generation has completed
   */
  docs: (inlineConfig: DocsInlineConfig) => Promise<void>;

  /**
   * Deploy the project source code
   *
   * @remarks
   * This method will prepare and build the Powerlines project, generating the necessary artifacts for the deployment.
   *
   * @param inlineConfig - The inline configuration for the deploy command
   */
  deploy: (inlineConfig: DeployInlineConfig) => Promise<void>;

  /**
   * Finalization process
   *
   * @remarks
   * This step includes any final processes or clean up required by Powerlines. It will be run after each Powerlines command.
   *
   * @returns A promise that resolves when the finalization process has completed
   */
  finalize: () => Promise<void>;
}

/**
 * Powerlines API Interface
 *
 * @remarks
 * The API interface represents the API available during a single execution of Powerlines. It provides access to the shared context and the ability to call plugin hooks. It extends the base API with additional functionality specific to command execution.
 */
export interface API<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends Execution {
  /**
   * The Powerlines shared API context
   */
  context: ExecutionContext<TResolvedConfig>;

  /**
   * Invokes the configured plugin hooks
   *
   * @remarks
   * By default, it will call the `"pre"`, `"normal"`, and `"post"` ordered hooks in sequence
   *
   * @param hook - The hook to call
   * @param options - The options to provide to the hook
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  callHook: <TKey extends string>(
    hook: TKey,
    options: CallHookOptions & {
      environment?: string | EnvironmentContext<TResolvedConfig>;
    },
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) => Promise<
    InferHookReturnType<PluginContext<TResolvedConfig>, TKey> | undefined
  >;
}

export interface ExecutionWorkerParams {
  /**
   * The execution options for the current execution instance
   */
  options: ExecutionOptions;

  /**
   * The initial configuration for the current execution instance, which is the result of merging the user configuration with any configuration provided by plugins during the "config" hook. This is typically the user configuration provided in the Powerlines configuration file, but may also include additional configuration options provided by plugins or other sources.
   */
  initialConfig: InitialConfig;

  /**
   * The inline configuration for the current execution instance, which is the result of merging the user configuration with any configuration provided by plugins during the "config" hook.
   */
  inlineConfig: InlineConfig;
}

export type ExecutionWorkerProcess = WorkerProcess<
  ExecutionWorkerParams,
  typeof POWERLINES_API_FUNCTIONS
>;

/**
 * The Engine API interface represents the API available during the entire lifecycle of the Powerlines engine. It provides access to the shared context and the registered command executions. It extends the base API with additional functionality specific to the engine lifecycle.
 */
export interface Engine extends Execution {
  /**
   * The Powerlines shared context
   */
  context: EngineContext;
}
