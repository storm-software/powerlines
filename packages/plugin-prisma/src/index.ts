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

import { execute, executePackage } from "@stryke/cli/execute";
import { existsSync } from "@stryke/fs/exists";
import { isPackageListed } from "@stryke/fs/package-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import defu from "defu";
import { getConfigPath } from "powerlines/plugin-utils/get-config-path";
import { Plugin } from "powerlines/types/plugin";
import { getSchema } from "./helpers/get-schema";
import { PrismaSchemaCreator } from "./helpers/schema-creator";
import {
  PrismaPluginContext,
  PrismaPluginOptions,
  PrismaPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate Prisma for code generation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends PrismaPluginContext = PrismaPluginContext
>(
  options: PrismaPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "prisma",
    config() {
      return {
        prisma: defu(options, {
          schema: joinPaths(this.config.projectRoot, "prisma", "schema.prisma"),
          configFile:
            options.configFile || getConfigPath(this, "prisma.config"),
          generatedPath: joinPaths("{builtinPath}", "prisma")
        })
      } as Partial<PrismaPluginUserConfig>;
    },
    async configResolved() {
      this.dependencies["@prisma/client"] = "latest";

      this.config.prisma.configFile = this.config.prisma.configFile?.replace(
        "{projectRoot}",
        this.config.projectRoot
      );

      if (!this.config.prisma.schema) {
        throw new Error(
          `Prisma schema path is not defined. Please specify a valid path in the plugin configuration.`
        );
      }

      this.config.prisma.schema = this.config.prisma.schema.replace(
        "{projectRoot}",
        this.config.projectRoot
      );

      if (!this.config.prisma.generatedPath) {
        throw new Error(
          `Prisma generated path is not defined. Please specify a valid path in the plugin configuration.`
        );
      }

      this.config.prisma.generatedPath =
        this.config.prisma.generatedPath.replace(
          "{builtinPath}",
          this.builtinsPath
        );

      this.prisma ??= {} as TContext["prisma"];
      if (!existsSync(this.config.prisma.schema)) {
        this.prisma.schema ??= {
          generators: [],
          datasources: [],
          warnings: []
        };
      } else {
        this.prisma.schema = await getSchema({
          datamodel: this.config.prisma.schema
        });
      }

      const generator = this.prisma.schema.generators.find(
        gen => gen.provider.value === "prisma-client-js"
      );
      if (!generator) {
        this.prisma.schema.generators.push({
          name: "prisma-client-js",
          provider: {
            value: "prisma-client-js",
            fromEnvVar: null
          },
          output: {
            value: this.config.prisma.generatedPath,
            fromEnvVar: null
          },
          config: {},
          binaryTargets: [],
          previewFeatures: [],
          sourceFilePath: this.config.prisma.schema
        });
      } else {
        generator.output ??= {
          value: this.config.prisma.generatedPath,
          fromEnvVar: null
        };
      }

      this.prisma.builder = new PrismaSchemaCreator(this);
    },
    async prepare() {
      // Write the schema file before invoking Prisma - Generate
      await this.prisma.builder.write();

      const args = ["generate", "--schema", this.config.prisma.schema];
      if (!this.config.prisma.prismaPath) {
        const isPrismaListed = await isPackageListed(
          "prisma",
          this.config.projectRoot
        );

        args.unshift(
          isPrismaListed
            ? replacePath(this.config.sourceRoot, this.config.projectRoot)
            : this.config.sourceRoot
        );

        const result = await executePackage(
          "prisma",
          args,
          joinPaths(this.workspaceConfig.workspaceRoot, this.config.projectRoot)
        );
        if (result.failed) {
          throw new Error(
            `Prisma process exited with code ${result.exitCode}.`
          );
        }
      } else {
        args.unshift(this.config.prisma.prismaPath);

        const result = await execute(args.join(" "), this.config.projectRoot);
        if (result.failed) {
          throw new Error(
            `Prisma process exited with code ${result.exitCode}.`
          );
        }
      }
    }
  };
};

export default plugin;
