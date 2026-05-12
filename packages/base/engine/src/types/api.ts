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
  BuildInlineConfig,
  CleanInlineConfig,
  CreateInlineConfig,
  DeployInlineConfig,
  DocsInlineConfig,
  ExecutionOptions,
  InlineConfig,
  LintInlineConfig,
  PrepareInlineConfig,
  TestInlineConfig,
  TypesInlineConfig
} from "@powerlines/core";
import { EXECUTION_API_METHODS } from "@powerlines/core/constants/api";
import type { EngineContext } from "./context";
import type { Worker } from "./utils";

/**
 * The Powerlines Base API Interface
 *
 * @remarks
 * This interface defines the base API for Powerlines, which includes the shared context and the core commands. It is extended by the ExecutionAPI and EngineAPI interfaces to provide additional functionality specific to their respective contexts.
 */
export interface ExecutionInterface {
  /**
   * Prepare the Powerlines API
   *
   * @remarks
   * This method will prepare the Powerlines API for use, initializing any necessary resources.
   *
   * @param inlineConfig - The inline configuration for the prepare command
   */
  prepare: (inlineConfig: PrepareInlineConfig) => Promise<void>;

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
   * @param inlineConfig - The inline configuration for the create command
   * @returns A promise that resolves when the project has been created
   */
  create: (inlineConfig: CreateInlineConfig) => Promise<void>;

  /**
   * Clean any previously prepared artifacts
   *
   * @remarks
   * This method will remove the previous Powerlines artifacts from the project.
   *
   * @param inlineConfig - The inline configuration for the clean command
   * @returns A promise that resolves when the clean command has completed
   */
  clean: (inlineConfig: CleanInlineConfig) => Promise<void>;

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

export interface ExecutionHostParams {
  /**
   * The execution options for the current execution instance
   */
  options: ExecutionOptions;

  /**
   * The inline configuration for the current execution instance, which is the result of merging the user configuration with any configuration provided by plugins during the "config" hook.
   */
  inlineConfig: InlineConfig;
}

export type ExecutionHost<TExecutionAPI extends ReadonlyArray<string>> = Worker<
  ExecutionHostParams,
  TExecutionAPI
>;

export type PowerlinesExecutionHost = ExecutionHost<
  typeof EXECUTION_API_METHODS
>;

/**
 * The Engine interface represents the Powerlines process' orchestration and coordination API.
 */
export interface Engine<
  TExecutionAPI extends ReadonlyArray<string>
> extends ExecutionInterface {
  /**
   * The Powerlines shared context
   */
  context: EngineContext;

  /**
   * The execution host, which provides methods to call the execution API functions from the engine context. This allows the engine to invoke commands and other API functions during the execution of Powerlines commands, enabling communication between the engine and the execution contexts.
   */
  host: ExecutionHost<TExecutionAPI>;
}
