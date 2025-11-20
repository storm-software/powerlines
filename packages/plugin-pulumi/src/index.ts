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
  LocalWorkspace
} from "@pulumi/pulumi/automation";
import { omit } from "@stryke/helpers/index";
import { joinPaths } from "@stryke/path/join";
import { kebabCase } from "@stryke/string-format/kebab-case";
import defu from "defu";
import {
  getOrganizationName,
  getWorkspaceName
} from "powerlines/plugin-utils/context-helpers";
import { Plugin } from "powerlines/types/plugin";
import {
  PulumiPluginContext,
  PulumiPluginCreateStackInlineOptions,
  PulumiPluginCreateStackLocalOptions,
  PulumiPluginCreateStackOptions,
  PulumiPluginExistingStackOptions,
  PulumiPluginOptions
} from "./types/plugin";

export * from "./types";

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
): Plugin<TContext> => {
  return {
    name: "pulumi",
    async config() {
      return {
        deploy: {
          pulumi: defu(options, {
            projectName: this.config.name,
            workDir: joinPaths(this.artifactsPath, "infrastructure"),
            settings: {}
          })
        }
      };
    },
    async configResolved() {
      if (!(options as PulumiPluginExistingStackOptions).stack) {
        (
          this.config.deploy.pulumi as PulumiPluginCreateStackOptions
        ).stackName ??= fullyQualifiedStackName(
          kebabCase(getOrganizationName(this) || "default"),
          `${
            getWorkspaceName(this)
              ? `${kebabCase(getWorkspaceName(this))}-`
              : ""
          }${kebabCase(this.config.name)}`,
          this.config.mode
        );
      }
    },
    deploy: {
      order: "post",
      async handler() {
        this.info(
          `Deploying Pulumi stack: ${
            (this.config.deploy.pulumi as PulumiPluginExistingStackOptions)
              .stack?.name ||
            (this.config.deploy.pulumi as PulumiPluginCreateStackOptions)
              .stackName
          }`
        );

        if (
          (!(options as PulumiPluginExistingStackOptions).stack &&
            !(options as PulumiPluginCreateStackInlineOptions).program &&
            !(options as PulumiPluginCreateStackInlineOptions).projectName) ||
          !(options as PulumiPluginCreateStackLocalOptions).workDir
        ) {
          throw new Error(
            `Pulumi plugin requires either an inline program or a working directory to be specified.`
          );
        }

        let stack = (options as PulumiPluginExistingStackOptions).stack;
        stack ??= await LocalWorkspace.createOrSelectStack(
          omit(this.config.deploy.pulumi as PulumiPluginCreateStackOptions, [
            "options",
            "settings"
          ]) as Parameters<typeof LocalWorkspace.createOrSelectStack>[0]
        );

        if (
          this.config.deploy.pulumi.settings &&
          Object.keys(this.config.deploy.pulumi.settings).length > 0
        ) {
          await stack.workspace.saveStackSettings(
            stack.name,
            this.config.deploy.pulumi.settings
          );
        }

        await stack.refresh({ onOutput: this.debug.bind(this) });

        if (this.config.deploy.pulumi.destroy) {
          await stack.destroy({ onOutput: this.debug.bind(this) });
        }

        const result = await stack.up({
          onOutput: this.debug.bind(this)
        });

        this.info(
          `Successfully deployed ${stack.name} (v${result.summary.version}): ${result.summary.message}`
        );
      }
    }
  } as Plugin<TContext>;
};

export default plugin;
