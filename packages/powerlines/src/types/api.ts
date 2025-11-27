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

import { CallHookOptions } from "../internal/helpers/hooks";
import {
  BuildInlineConfig,
  CleanInlineConfig,
  DeployInlineConfig,
  DocsInlineConfig,
  LintInlineConfig,
  NewInlineConfig,
  PrepareInlineConfig
} from "./config";
import type { APIContext, EnvironmentContext, PluginContext } from "./context";
import { HookKeys, InferHookParameters, InferHookReturnType } from "./hooks";
import { ResolvedConfig } from "./resolved";

/**
 * Powerlines API Interface
 */
export interface API<TResolvedConfig extends ResolvedConfig = ResolvedConfig> {
  /**
   * The Powerlines shared API context
   */
  context: APIContext<TResolvedConfig>;

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
  callHook: <TKey extends HookKeys<PluginContext<TResolvedConfig>>>(
    hook: TKey,
    options: CallHookOptions & {
      environment?: string | EnvironmentContext<TResolvedConfig>;
    },
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) => Promise<
    InferHookReturnType<PluginContext<TResolvedConfig>, TKey> | undefined
  >;
}
