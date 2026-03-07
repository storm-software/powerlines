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

import * as prismaPostgres from "@pulumi/prisma-postgres";
import { execute, executePackage } from "@stryke/cli/execute";
import { existsSync } from "@stryke/fs/exists";
import { joinPaths } from "@stryke/path/join-paths";
import { constantCase } from "@stryke/string-format/constant-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import defu from "defu";
import { Plugin } from "powerlines";
import { getConfigPath, replacePathTokens } from "powerlines/plugin-utils";
import { getSchema } from "./helpers/get-schema";
import { PrismaSchemaCreator } from "./helpers/schema-creator";
import {
  PrismaPluginContext,
  PrismaPluginOptions,
  PrismaPluginUserConfig
} from "./types/plugin";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    prisma?: PrismaPluginOptions;
  }
}

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
          schema: joinPaths(this.config.root, "prisma", "schema.prisma"),
          configFile:
            options.configFile || getConfigPath(this, "prisma.config"),
          outputPath: joinPaths("{builtinPath}", "prisma"),
          prismaPostgres: options?.prismaPostgres
            ? {
                projectId: this.config.name,
                region: "us-east-1"
              }
            : undefined
        })
      } as Partial<PrismaPluginUserConfig>;
    },
    async configResolved() {
      this.dependencies["@prisma/ppg"] = "latest";

      this.config.prisma.configFile = replacePathTokens(
        this,
        this.config.prisma.configFile
      );

      if (!this.config.prisma.schema) {
        throw new Error(
          `Prisma schema path is not defined. Please specify a valid path in the plugin configuration.`
        );
      }

      this.config.prisma.schema = replacePathTokens(
        this,
        this.config.prisma.schema
      );

      if (!this.config.prisma.outputPath) {
        throw new Error(
          `Prisma generated path is not defined. Please specify a valid path in the plugin configuration.`
        );
      }

      this.config.prisma.outputPath = replacePathTokens(
        this,
        this.config.prisma.outputPath
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
        gen => gen.provider.value === "prisma-client"
      );
      if (!generator) {
        this.prisma.schema.generators.push({
          name: "prisma-client",
          provider: {
            value: "prisma-client",
            fromEnvVar: null
          },
          output: {
            value: this.config.prisma.outputPath,
            fromEnvVar: null
          },
          config: {},
          binaryTargets: [],
          previewFeatures: [],
          sourceFilePath: this.config.prisma.schema
        });
      } else {
        generator.output ??= {
          value: this.config.prisma.outputPath,
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
        args.unshift(this.config.root);

        const result = await executePackage(
          "prisma",
          args,
          joinPaths(this.workspaceConfig.workspaceRoot, this.config.root)
        );
        if (result.failed) {
          throw new Error(
            `Prisma process exited with code ${result.exitCode}.`
          );
        }
      } else {
        args.unshift(this.config.prisma.prismaPath);

        const result = await execute(args.join(" "), this.config.root);
        if (result.failed) {
          throw new Error(
            `Prisma process exited with code ${result.exitCode}.`
          );
        }
      }
    },
    async deployPulumi() {
      if (this.config.prisma.prismaPostgres) {
        let serviceToken = process.env.PRISMA_SERVICE_TOKEN;
        if (!serviceToken) {
          serviceToken = options.serviceToken;
          if (serviceToken) {
            this.warn(
              "If possible, please use the `PRISMA_SERVICE_TOKEN` environment variable instead of using the `serviceToken` option directly. The `serviceToken` option will work; however, this is a less secure method of configuration."
            );
          } else {
            throw new Error(
              "Unable to determine the Prisma service token. Please set the `PRISMA_SERVICE_TOKEN` environment variable."
            );
          }
        }

        await this.pulumi.workspace.installPlugin(
          "registry.terraform.io/prisma/prisma-postgres",
          "v0.2.0"
        );

        const project = new prismaPostgres.Project("project", {
          name: `${
            this.config.prisma.prismaPostgres?.projectId || this.config.name
          }`
        });
        const database = new prismaPostgres.Database("database", {
          projectId: project.id,
          name: `${
            this.config.prisma.prismaPostgres?.databaseName ||
            `${kebabCase(this.config.name)}.${
              this.config.mode
            }.${this.config.prisma.prismaPostgres?.region}`
          }`,
          region: `${this.config.prisma.prismaPostgres?.region}`
        });

        return {
          project,
          database,
          connection: new prismaPostgres.Connection("connection", {
            databaseId: database.id,
            name: `${constantCase(this.config.name)}_API_KEY`
          })
        };
      }
    }
  };
};

export default plugin;
