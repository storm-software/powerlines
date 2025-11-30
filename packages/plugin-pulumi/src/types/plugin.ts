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

import {
  LocalWorkspaceOptions,
  PulumiFn,
  Stack,
  StackSettings
} from "@pulumi/pulumi/automation";
import { DeployConfig, UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export interface PulumiPluginBaseOptions {
  /**
   * Whether to destroy the stack during the `destroy` lifecycle phase.
   *
   * @defaultValue false
   */
  destroy?: boolean;

  /**
   * Additional stack settings.
   */
  settings?: StackSettings;
}

export interface PulumiPluginExistingStackOptions extends PulumiPluginBaseOptions {
  /**
   * The Pulumi Stack instance to use for deployment operations.
   */
  stack?: Stack;
}

export interface PulumiPluginCreateStackOptions extends PulumiPluginBaseOptions {
  /**
   * The associated stack name.
   */
  stackName?: string;

  /**
   * Additional options for the Pulumi Workspace.
   */
  options?: LocalWorkspaceOptions;
}

export interface PulumiPluginExistingStackOptions {
  /**
   * The Pulumi Stack instance to use for deployment operations.
   */
  stack?: Stack;
}

export interface PulumiPluginCreateStackInlineOptions extends PulumiPluginCreateStackOptions {
  /**
   * The associated project name.
   */
  projectName?: string;

  /**
   * The inline (in-process) Pulumi program to use with update and preview operations.
   */
  program?: PulumiFn;
}

export interface PulumiPluginCreateStackLocalOptions extends PulumiPluginCreateStackOptions {
  /**
   * The working directory of the program.
   *
   * @defaultValue "\{artifactsPath\}/infrastructure"
   */
  workDir?: string;
}

export type PulumiPluginOptions =
  | PulumiPluginExistingStackOptions
  | PulumiPluginCreateStackInlineOptions
  | PulumiPluginCreateStackLocalOptions;

export type PulumiPluginResolvedOptions =
  | (Omit<PulumiPluginExistingStackOptions, "stack"> &
      Required<Pick<PulumiPluginExistingStackOptions, "stack">>)
  | (Omit<
      PulumiPluginCreateStackInlineOptions,
      "stackName" | "projectName" | "program"
    > &
      Required<
        Pick<
          PulumiPluginCreateStackInlineOptions,
          "stackName" | "projectName" | "program"
        >
      >)
  | (Omit<PulumiPluginCreateStackLocalOptions, "stackName" | "workDir"> &
      Required<
        Pick<PulumiPluginCreateStackLocalOptions, "stackName" | "workDir">
      >);

export interface PulumiPluginDeployConfig extends DeployConfig {
  pulumi: PulumiPluginOptions;
}

export interface PulumiPluginUserConfig extends UserConfig {
  deploy: PulumiPluginDeployConfig;
}

export interface PulumiPluginResolvedConfig extends ResolvedConfig {
  deploy: PulumiPluginDeployConfig;
}

export type PulumiPluginContext<
  TResolvedConfig extends PulumiPluginResolvedConfig =
    PulumiPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
