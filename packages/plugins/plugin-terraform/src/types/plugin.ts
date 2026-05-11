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

import { PluginContext, ResolvedConfig, UserConfig } from "powerlines";
import { TerraformContext } from "./terraform";

export interface TerraformPluginOptions {
  /**
   * The name of the Terraform stack to deploy
   *
   * @remarks
   * If not specified, the stack name will be generated based on the organization, workspace, project, and mode. The format of the generated stack name is `{organizationName}-{workspaceName}-{projectName}-{mode}`, where `workspaceName` is only included if it is different from both `organizationName` and `projectName`.
   *
   * For example, if the organization name is "my-org", the workspace name is "my-workspace", the project name is "my-project", and the mode is "production", the generated stack name will be `my-org-my-workspace-my-project-production`. If the workspace name is "my-project" (same as project name), the generated stack name will be `my-org-my-project-production`.
   *
   * @defaultvalue `{organizationName}-{workspaceName}-{projectName}-{mode}`
   */
  stackName?: string;

  /**
   * Whether to auto-approve the plan
   *
   * @defaultvalue false
   */
  autoApproval?: boolean;

  /**
   * The plan file
   *
   * @defaultvalue "plan.out"
   */
  planFile?: string;

  /**
   * Whether to format the files before writing
   *
   * @defaultvalue false
   */
  formatWrite?: boolean;

  /**
   * Whether to upgrade the modules
   *
   * @defaultvalue false
   */
  upgrade?: boolean;

  /**
   * Whether to destroy the stack
   *
   * @remarks
   * This will run `terraform destroy` instead of `terraform apply`. Use with caution, as this will destroy all resources in the stack. This option is intended for use in CI/CD pipelines, and should not be used in development or production environments.
   *
   * @defaultvalue false
   */
  destroy?: boolean;

  /**
   * Whether to migrate the state
   *
   * @defaultvalue false
   */
  migrateState?: boolean;

  /**
   * Whether to lock the state
   *
   * @defaultvalue false
   */
  lock?: boolean;

  /**
   * The variable file
   *
   * @defaultvalue "variables.tf"
   */
  varFile?: string;

  /**
   * Whether to reconfigure the state
   *
   * @defaultvalue false
   */
  reconfigure?: boolean;
}

export interface TerraformPluginUserConfig extends UserConfig {
  terraform?: TerraformPluginOptions;
}

export interface TerraformPluginResolvedConfig extends ResolvedConfig {
  terraform: TerraformPluginOptions;
}

export type TerraformPluginContext<
  TResolvedConfig extends TerraformPluginResolvedConfig =
    TerraformPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  terraform: TerraformContext;
};
