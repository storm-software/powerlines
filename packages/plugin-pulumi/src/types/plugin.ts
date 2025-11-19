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

import { LocalWorkspaceOptions, Stack } from "@pulumi/pulumi/automation";
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export interface PulumiPluginOptions {
  /**
   * The associated stack name.
   */
  stackName?: string;

  /**
   * The working directory of the program.
   *
   * @defaultValue "\{artifactsPath\}/infrastructure"
   */
  workDir?: string;

  /**
   * Whether to destroy the stack during the `destroy` lifecycle phase.
   *
   * @defaultValue false
   */
  destroy?: boolean;

  /**
   * Additional options for the Pulumi Workspace.
   */
  options?: LocalWorkspaceOptions;
}

export interface PulumiPluginUserConfig extends UserConfig {
  deploy: {
    pulumi: PulumiPluginOptions;
  };
}

export interface PulumiPluginResolvedConfig extends ResolvedConfig {
  deploy: {
    pulumi: Omit<PulumiPluginOptions, "stackName" | "workDir"> &
      Required<Pick<PulumiPluginOptions, "stackName" | "workDir">>;
  };
}

export type PulumiPluginContext<
  TResolvedConfig extends
    PulumiPluginResolvedConfig = PulumiPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  pulumi: Stack;
};
