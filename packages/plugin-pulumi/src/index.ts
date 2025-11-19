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
import { PulumiPluginContext, PulumiPluginOptions } from "./types/plugin";

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
            workDir: joinPaths(this.artifactsPath, "infrastructure")
          })
        }
      };
    },
    async configResolved() {
      this.config.deploy.pulumi.stackName ??= fullyQualifiedStackName(
        kebabCase(getOrganizationName(this) || "default"),
        `${
          getWorkspaceName(this) ? `${kebabCase(getWorkspaceName(this))}-` : ""
        }${kebabCase(this.config.name)}`,
        this.config.mode
      );

      this.pulumi = await LocalWorkspace.createOrSelectStack(
        omit(this.config.deploy.pulumi, ["options"]),
        this.config.deploy.pulumi.options
      );
    },
    deploy: {
      order: "post",
      async handler() {
        await this.pulumi.refresh({ onOutput: this.debug.bind(this) });

        if (this.config.deploy.pulumi.destroy) {
          await this.pulumi.destroy({ onOutput: this.debug.bind(this) });
        }

        const result = await this.pulumi.up({
          onOutput: this.debug.bind(this)
        });

        this.info(
          `Successfully deployed ${this.config.deploy.pulumi.stackName} (v${result.summary.version}): ${result.summary.message}`
        );
      }
    }
  } as Plugin<TContext>;
};

export default plugin;
