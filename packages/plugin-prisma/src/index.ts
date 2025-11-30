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
import { replacePathTokens } from "powerlines/plugin-utils/paths";
import { Plugin } from "powerlines/types/plugin";
import { createClient } from "./api/client/client.gen";
import type { ClientOptions } from "./api/client/types.gen";
import { createConfig } from "./api/client/utils.gen";
import { PrismaClient } from "./api/sdk.gen";
import { CreateDatabaseData } from "./api/types.gen";
import { getSchema } from "./helpers/get-schema";
import { PrismaSchemaCreator } from "./helpers/schema-creator";
import {
  PrismaPluginContext,
  PrismaPluginOptions,
  PrismaPluginUserConfig
} from "./types/plugin";

export * from "./api/client.gen";
export * from "./api/sdk.gen";
export * from "./api/types.gen";
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
      this.dependencies["@prisma/client"] = "latest";

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

        const client = createClient(
          createConfig<ClientOptions>({
            baseUrl: "https://api.prisma.io",
            throwOnError: true,
            headers: {
              Authorization: `Bearer ${serviceToken}`,
              "User-Agent": "powerlines/1.0"
            }
          })
        );

        this.prisma.api = new PrismaClient({
          client
        });

        await this.prisma.api
          .createDatabase({
            path: {
              projectId: this.config.prisma.prismaPostgres.projectId
            },
            body: {
              isDefault: false,
              name:
                this.config.prisma.prismaPostgres.databaseName ||
                `${this.config.prisma.prismaPostgres.region}.${this.config.mode}.${this.config.name}`,
              region: this.config.prisma.prismaPostgres.region
            } as CreateDatabaseData["body"]
          })
          .then(response => response.data.data);
      }

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
