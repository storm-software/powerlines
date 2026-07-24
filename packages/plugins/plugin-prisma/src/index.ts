/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { GeneratorConfigObject } from "@power-plant/core";
import type { Options as PowerPlantPrismaOptions } from "@power-plant/prisma";
import type { PrismaSchema } from "@power-plant/prisma-schema";
import powerPlant from "@powerlines/plugin-power-plant";
import pulumi from "@powerlines/plugin-pulumi";
import { joinPaths } from "@stryke/path/join-paths";
import { constantCase } from "@stryke/string-format/constant-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import defu from "defu";
import { createRequire } from "node:module";
import type { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import type {
  PrismaPluginContext,
  PrismaPluginOptions
} from "./types/plugin";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    prisma?: PrismaPluginOptions;
  }
}

/**
 * Load packages via CJS where published ESM is unreliable.
 *
 * @remarks
 * Prisma's published ESM builds use extensionless relative imports that fail
 * under Node's native ESM resolver. The CJS entry works. `@pulumi/prisma-postgres`
 * is also resolved at deploy time only (Terraform provider stub).
 */
const require = createRequire(import.meta.url);
const prismaGenerator = require("@power-plant/prisma") as GeneratorConfigObject<
  PrismaSchema,
  PowerPlantPrismaOptions
>;

/**
 * A Powerlines plugin to integrate Prisma for code generation via Power Plant.
 *
 * @see https://www.prisma.io/docs/orm/prisma-schema/overview/generators
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/prisma
 *
 * @param options - The plugin options.
 * @returns Powerlines plugin instances.
 */
export const plugin = <
  TContext extends PrismaPluginContext = PrismaPluginContext
>(
  options: PrismaPluginOptions = {}
): Plugin<TContext>[] => {
  const generatorConfig = {
    ...prismaGenerator
  } as GeneratorConfigObject<PrismaSchema, PowerPlantPrismaOptions>;

  return [
    powerPlant<PrismaSchema, PowerPlantPrismaOptions, TContext>(
      generatorConfig
    ),
    ...pulumi<TContext>(options.pulumi),
    {
      name: "prisma",
      config() {
        return {
          prisma: defu(options, {
            schema: joinPaths(this.config.root, "prisma"),
            printDownloadProgress: true,
            allowNoModels: true,
            prismaPostgres: options.prismaPostgres
              ? {
                  projectId: this.config.name,
                  region: "us-east-1"
                }
              : undefined
          })
        };
      },
      async configResolved() {
        this.dependencies["@prisma/ppg"] = "latest";

        if (!this.config.prisma.schema) {
          throw new Error(
            `Prisma schema path is not defined. Please specify a valid path in the plugin configuration.`
          );
        }

        this.config.prisma.schema = replacePathTokens(
          this,
          this.config.prisma.schema
        );

        const {
          schema,
          printDownloadProgress,
          allowNoModels,
          generatorNames,
          skipDownload,
          serviceToken: _serviceToken,
          prismaPostgres: _prismaPostgres,
          pulumi: _pulumi,
          ...rest
        } = this.config.prisma;

        this.config.powerplant = {
          ...generatorConfig
        };

        this.powerplant.options = {
          ...rest,
          schemaPath: schema,
          printDownloadProgress,
          allowNoModels,
          generatorNames,
          skipDownload
        } as TContext["powerplant"]["options"];
      },
      pulumi: {
        async deploy() {
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

            const prismaPostgres = require("@pulumi/prisma-postgres") as typeof import("@pulumi/prisma-postgres");

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

          return null;
        }
      }
    }
  ];
};

export default plugin;
