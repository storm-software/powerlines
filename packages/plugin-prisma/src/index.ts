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

import pulumi from "@powerlines/plugin-pulumi";
import { defaultRegistry } from "@prisma/client-generator-registry";
import { enginesVersion } from "@prisma/engines";
import type { Generator } from "@prisma/internals";
import {
  extractPreviewFeatures,
  getDMMF,
  getGenerators,
  SchemaContext,
  validatePrismaConfigWithDatasource
} from "@prisma/internals";
import * as prismaPostgres from "@pulumi/prisma-postgres";
import { toArray } from "@stryke/convert/to-array";
import { appendPath } from "@stryke/path/append";
import { findBasePath } from "@stryke/path/common";
import { relativePath } from "@stryke/path/find";
import { joinPaths } from "@stryke/path/join-paths";
import { constantCase } from "@stryke/string-format/constant-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import defu from "defu";
import { Plugin } from "powerlines";
import { getConfigPath, replacePathTokens } from "powerlines/plugin-utils";
import { PowerlinesClientGenerator } from "./helpers/client-generator";
import { getSchema } from "./helpers/get-schema";
import { PrismaSchemaCreator } from "./helpers/schema-creator";
import { introspectSql } from "./helpers/typed-sql";
import {
  PrismaPluginContext,
  PrismaPluginOptions,
  PrismaPluginUserConfig,
  PrismaSchemaContext
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
): Plugin<TContext>[] => {
  return [
    ...pulumi<TContext>(options.pulumi),
    {
      name: "prisma",
      config() {
        return {
          prisma: defu(options, {
            schema: joinPaths(this.config.root, "prisma", "*.prisma"),
            configFile:
              options.configFile || getConfigPath(this, "prisma.config"),
            runtime: options.runtime || "nodejs",
            outputPath: joinPaths("{builtinPath}", "prisma"),
            prismaPostgres: options.prismaPostgres
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

        this.config.prisma.schema = toArray(this.config.prisma.schema).map(
          schemaPath => replacePathTokens(this, schemaPath)
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

        this.prisma.config = validatePrismaConfigWithDatasource({
          config: this.config.prisma,
          cmd: "generate --sql"
        });

        const schemaRootDir = appendPath(
          appendPath(findBasePath(this.config.prisma.schema), this.config.root),
          this.config.cwd
        );
        this.prisma.schema ??= {
          schemaRootDir,
          loadedFromPathForLogMessages: relativePath(
            this.config.root,
            schemaRootDir
          ),
          schemaPath: schemaRootDir,
          schemas: [],
          schemaFiles: [],
          generators: [],
          datasources: [],
          warnings: [],
          primaryDatasource: undefined
        } as PrismaSchemaContext;

        this.prisma.schema.schemas = await Promise.all(
          (
            await this.fs.glob(
              this.config.prisma.schema.map(schema =>
                schema.includes("*") || this.fs.isFileSync(schema)
                  ? schema
                  : joinPaths(schema, "**/*.prisma")
              )
            )
          ).map(async schema => getSchema(schema))
        );

        this.prisma.schema = this.prisma.schema.schemas.reduce(
          (ret, schema) => {
            ret.datasources.push(...schema.datasources);
            ret.generators.push(...schema.generators);
            ret.warnings.push(...schema.warnings);
            ret.schemaFiles.push([schema.path, schema.content]);

            return ret;
          },
          this.prisma.schema
        );

        this.prisma.schema.primaryDatasource =
          this.prisma.schema.datasources.at(0);
        this.prisma.schema.schemaPath = this.prisma.schema.schemas.at(0)!.path!;

        this.prisma.builder = new PrismaSchemaCreator(this);
      },
      async prepare() {
        // Write the schema file before invoking Prisma - Generate
        await this.prisma.builder.write();

        this.prisma.previewFeatures = extractPreviewFeatures(
          this.prisma.schema.generators
        );

        this.prisma.dmmf = await getDMMF({
          datamodel: this.prisma.schema.schemaFiles,
          previewFeatures: this.prisma.previewFeatures
        });

        const typedSql = await introspectSql(this);

        let generators = (await getGenerators({
          schemaContext: this.prisma.schema as SchemaContext,
          printDownloadProgress: true,
          version: enginesVersion,
          typedSql,
          allowNoModels: true,
          registry: defaultRegistry.toInternal()
        })) as (Generator | PowerlinesClientGenerator)[];
        if (
          !generators ||
          !generators.some(gen =>
            ["prisma-client", "prisma-client-js", "prisma-client-ts"].includes(
              (gen as PowerlinesClientGenerator).name ||
                (gen as Generator).getProvider()
            )
          )
        ) {
          generators ??= [];
          generators.push(new PowerlinesClientGenerator(this));
        } else {
          // Replace prisma-client generator with PowerlinesClientGenerator
          generators = generators.map(generator =>
            ["prisma-client", "prisma-client-js", "prisma-client-ts"].includes(
              (generator as PowerlinesClientGenerator).name ||
                (generator as Generator).getProvider()
            )
              ? new PowerlinesClientGenerator(this)
              : generator
          );
        }

        for (const generator of generators) {
          try {
            await generator.generate();
            generator.stop();
          } catch (err) {
            generator.stop();
            this.error(
              `Error while generating with ${
                (generator as PowerlinesClientGenerator).name ||
                (generator as Generator).getProvider()
              }: ${err instanceof Error ? err.message : String(err)}`
            );
          }
        }

        // if (this.config.prisma.prismaPath) {
        //   const result = await execute(
        //     `${this.config.prisma.prismaPath} generate --schema ${this.config.prisma.schema}`,
        //     this.config.root
        //   );
        //   if (result.failed) {
        //     throw new Error(
        //       `Prisma process exited with code ${result.exitCode}.`
        //     );
        //   }
        // } else {
        //   const result = await executePackage(
        //     "prisma",
        //     ["generate", "--schema", this.config.prisma.schema],
        //     joinPaths(this.config.cwd, this.config.root)
        //   );
        //   if (result.failed) {
        //     throw new Error(
        //       `Prisma process exited with code ${result.exitCode}.`
        //     );
        //   }
        // }
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
