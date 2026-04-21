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

import { kebabCase } from "@stryke/string-format/kebab-case";
import { isSetString } from "@stryke/type-checks";
import { MaybePromise } from "@stryke/types/base";
import defu from "defu";
import { execaCommand } from "execa";
import { Plugin, PluginContext } from "powerlines";
import { getOrganizationName, getWorkspaceName } from "powerlines/plugin-utils";
import { which } from "shelljs";
import { TerraformContext } from "./types";
import { Unstable_TerraformPluginContext } from "./types/_internal";
import { TerraformPluginContext, TerraformPluginOptions } from "./types/plugin";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    terraform?: TerraformPluginOptions;
  }

  interface BasePlugin<TContext extends PluginContext> {
    terraform?: {
      /**
       * Run the Terraform deployment to create or update infrastructure resources defined in the Terraform program. This hook is executed after the main build process, allowing you to manage your infrastructure as code using Terraform directly from your Powerlines plugin.
       *
       * @remarks
       * This hook will execute the Terraform program defined in the `config` hook, which should be used to define the infrastructure resources. The Terraform program will be executed sequentially, allowing you to define resources in multiple hooks if needed. The resources defined in the Terraform program will be passed to the next hook invocation, allowing you to manage dependencies between resources defined in different hooks.
       *
       * @param this - The plugin context.
       */
      deploy?: (this: TContext) => MaybePromise<void>;
    };
  }
}

/**
 * A package containing a Powerlines plugin to configure infrastructure and deploy a project using Terraform IaC.
 *
 * @see https://www.terraform.io
 *
 * @param options - The Terraform plugin user configuration options.
 * @returns A Powerlines plugin to configure infrastructure and deploy a project using Terraform.
 */
export const plugin = <
  TContext extends TerraformPluginContext = TerraformPluginContext
>(
  options: TerraformPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    {
      name: "terraform",
      async config() {
        return {
          deploy: {
            terraform: defu(options, {
              autoApproval: false,
              planFile: "plan.out",
              formatWrite: false,
              upgrade: false,
              destroy: false,
              migrateState: false,
              lock: true,
              reconfigure: false
            })
          }
        };
      },
      async configResolved() {
        this.terraform ??= {} as TerraformContext;

        const command = which("terragrunt")
          ? "terragrunt"
          : which("tofu")
            ? "tofu"
            : which("terraform")
              ? "terraform"
              : null;
        if (!command) {
          throw new Error(
            "Both OpenTofu and Terraform are not installed. Please install one of the two before running this executor."
          );
        }

        this.terraform.command = command;

        const organizationName = kebabCase(getOrganizationName(this));
        const workspaceName = kebabCase(await getWorkspaceName(this));
        const projectName = kebabCase(this.config.name);

        this.config.terraform.stackName ??= `${organizationName || workspaceName || projectName}-${
          workspaceName &&
          workspaceName !== organizationName &&
          workspaceName !== projectName
            ? `${workspaceName}-`
            : ""
        }${projectName}-${this.config.mode}`;
      },
      async deploy() {
        this.info(
          `Creating resources for Terraform stack: ${this.config.terraform.stackName}`
        );

        await (
          this as unknown as Unstable_TerraformPluginContext
        ).$$internal.callHook("terraform:deploy", {
          sequential: true
        });

        this.info(
          `Deploying Terraform stack: ${this.config.terraform.stackName}`
        );

        if (this.config.terraform.destroy) {
          await execaCommand(
            [
              this.terraform.command,
              this.terraform.command === "terragrunt"
                ? this.config.terraform.stackName
                : undefined,
              "destroy",
              this.config.terraform.autoApproval && "-auto-approve",
              this.config.terraform.varFile &&
                `--var ${this.config.terraform.varFile}`,
              isSetString(this.config.terraform.planFile) &&
                this.config.terraform.planFile
            ]
              .filter(Boolean)
              .join(" "),
            {
              preferLocal: true,
              shell: true,
              stdio: "inherit",
              cwd: this.infrastructurePath,
              env:
                this.config.mode === "production"
                  ? {
                      TF_IN_AUTOMATION: "true",
                      TF_INPUT: "0"
                    }
                  : {}
            }
          );
        }

        await execaCommand(
          [
            this.terraform.command,
            this.terraform.command === "terragrunt"
              ? this.config.terraform.stackName
              : undefined,
            "apply",
            this.config.terraform.autoApproval && "-auto-approve",
            this.config.terraform.varFile &&
              `--var ${this.config.terraform.varFile}`,
            isSetString(this.config.terraform.planFile) &&
              this.config.terraform.planFile
          ]
            .filter(Boolean)
            .join(" "),
          {
            preferLocal: true,
            shell: true,
            stdio: "inherit",
            cwd: this.infrastructurePath,
            env:
              this.config.mode === "production"
                ? {
                    TF_IN_AUTOMATION: "true",
                    TF_INPUT: "0"
                  }
                : {}
          }
        );

        this.info(`Successfully deployed ${this.config.terraform.stackName}`);
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
