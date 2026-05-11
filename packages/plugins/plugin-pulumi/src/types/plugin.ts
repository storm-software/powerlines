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
  InlineProgramArgs,
  LocalWorkspaceOptions,
  ProjectSettings,
  Stack,
  StackSettings
} from "@pulumi/pulumi/automation";
import { PluginContext, ResolvedConfig, UserConfig } from "powerlines";

export interface PulumiPluginOptions extends Partial<InlineProgramArgs> {
  /**
   * Additional options for the Pulumi Workspace.
   */
  options?: LocalWorkspaceOptions;

  /**
   * Whether to destroy the stack during the `destroy` lifecycle phase.
   *
   * @defaultValue false
   */
  destroy?: boolean;

  /**
   * Additional stack settings.
   */
  stackSettings?: StackSettings;

  /**
   * Additional project settings.
   */
  projectSettings?: Partial<ProjectSettings>;
}

export interface PulumiPluginUserConfig extends UserConfig {
  pulumi?: PulumiPluginOptions;
}

export interface PulumiPluginResolvedConfig extends ResolvedConfig {
  pulumi: PulumiPluginOptions;
}

export type PulumiPluginContext<
  TResolvedConfig extends PulumiPluginResolvedConfig =
    PulumiPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  pulumi: Stack;
};
