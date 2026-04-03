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
  fullyQualifiedStackName,
  LocalWorkspace,
  ProjectSettings
} from "@pulumi/pulumi/automation";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { MaybePromise } from "@stryke/types/base";
import defu from "defu";
import { Plugin, PluginContext } from "powerlines";
import { getOrganizationName, getWorkspaceName } from "powerlines/plugin-utils";
import { Unstable_PulumiPluginContext } from "./types/_internal";
import { PulumiPluginContext, PulumiPluginOptions } from "./types/plugin";
import { DeployPulumiResult, PulumiOutputRecord } from "./types/pulumi";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    pulumi?: PulumiPluginOptions;
  }

  interface BasePlugin<TContext extends PluginContext> {
    pulumi?: {
      /**
       * A hook that can be implemented to deploy Pulumi resources after the main build process. This allows you to define and manage your infrastructure as code using Pulumi, directly from your Powerlines plugin.
       *
       * @param this - The plugin context.
       * @param resources - An object containing the Pulumi resources' outputs that were added in earlier hook invocations.
       * @returns Optionally, the resources' outputs that were added during the Pulumi deployment that will be passed to the next hook invocation.
       */
      deploy?: (
        this: TContext,
        resources?: PulumiOutputRecord
      ) => MaybePromise<DeployPulumiResult>;
    };
  }
}

/**
 * A package containing a Powerlines plugin to configure infrastructure and deploy a project using Pulumi IaC.
 *
 * @see https://www.pulumi.com
 *
 * @param options - The Pulumi plugin user configuration options.
 * @returns A Powerlines plugin to configure infrastructure and deploy a project using Pulumi.
 */
export const plugin = <
  TContext extends PulumiPluginContext = PulumiPluginContext
>(
  options: PulumiPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    {
      name: "pulumi",
      async config() {
        return {
          deploy: {
            pulumi: defu(options, {
              projectName: this.config.name,
              settings: {}
            })
          }
        };
      },
      async configResolved() {
        const organizationName = kebabCase(getOrganizationName(this));
        const workspaceName = kebabCase(getWorkspaceName(this));
        const projectName = kebabCase(this.config.name);

        this.config.pulumi.stackName ??= fullyQualifiedStackName(
          organizationName || workspaceName || projectName,
          `${
            workspaceName &&
            workspaceName !== organizationName &&
            workspaceName !== projectName
              ? `${workspaceName}-`
              : ""
          }${projectName}`,
          this.config.mode
        );
      },
      async deploy() {
        this.info(
          `Creating resources for Pulumi stack: ${this.config.pulumi.stackName}`
        );

        this.pulumi ??= await LocalWorkspace.createOrSelectStack({
          ...(this.config.pulumi as Parameters<
            typeof LocalWorkspace.createOrSelectStack
          >[0]),
          program: async () => {
            this.debug(
              "Executing Pulumi program to define infrastructure resources."
            );

            const resources = {} as PulumiOutputRecord;
            await (
              this as unknown as Unstable_PulumiPluginContext
            ).$$internal.callHook(
              "pulumi:deploy",
              {
                sequential: true,
                result: "merge"
              },
              resources
            );

            this.debug(
              "Pulumi program execution completed. Resources have been defined."
            );
          }
        });
        await this.pulumi.workspace.installPlugin(
          "terraform-provider",
          "v1.0.2"
        );

        if (
          this.config.pulumi.stackSettings &&
          Object.keys(this.config.pulumi.stackSettings).length > 0
        ) {
          await this.pulumi.workspace.saveStackSettings(
            this.pulumi.name,
            this.config.pulumi.stackSettings
          );
        }

        await this.pulumi.workspace.saveProjectSettings(
          defu(this.config.pulumi.projectSettings ?? {}, {
            name: this.config.name,
            runtime: { name: "nodejs" },
            description: this.config.description,
            author: this.config.organization
          }) as ProjectSettings
        );

        this.info(`Deploying Pulumi stack: ${this.config.pulumi.stackName}`);

        await this.pulumi.refresh({ onOutput: this.debug.bind(this) });

        if (this.config.pulumi.destroy) {
          await this.pulumi.destroy({
            onOutput: this.debug.bind(this)
          });
        }

        const result = await this.pulumi.up({
          onOutput: this.debug.bind(this)
        });

        this.info(
          `Successfully deployed ${this.pulumi.name} (v${
            result.summary.version
          }): ${result.summary.message}`
        );
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
