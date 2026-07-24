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
import type { Options as PowerPlantGraphQLCodegenOptions } from "@power-plant/graphql-codegen";
import graphqlCodegenGenerator from "@power-plant/graphql-codegen";
import { schemaToCodegenDocument } from "@power-plant/graphql-schema/codegen";
import powerPlant from "@powerlines/plugin-power-plant";
import { existsSync } from "@stryke/fs/exists";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import type { GraphQLSchema } from "graphql";
import { buildSchema, isSchema } from "graphql";
import type { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import type {
  GraphQLPluginContext,
  GraphQLPluginOptions
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  interface Config {
    graphql?: GraphQLPluginOptions;
  }
}

/**
 * A Powerlines plugin to integrate GraphQL Codegen via Power Plant.
 *
 * @see https://the-guild.dev/graphql/codegen
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/graphql-codegen
 *
 * @param options - The plugin options.
 * @returns Powerlines plugin instances.
 */
export const plugin = <
  TContext extends GraphQLPluginContext = GraphQLPluginContext
>(
  options: GraphQLPluginOptions = {}
): Plugin<TContext>[] => {
  const generatorConfig = {
    ...(graphqlCodegenGenerator as GeneratorConfigObject<
      GraphQLSchema,
      PowerPlantGraphQLCodegenOptions
    >)
  } as GeneratorConfigObject<GraphQLSchema, PowerPlantGraphQLCodegenOptions>;

  return [
    powerPlant<GraphQLSchema, PowerPlantGraphQLCodegenOptions, TContext>(
      generatorConfig
    ),
    {
      name: "graphql",
      config() {
        return {
          graphql: defu(options, {
            schema: joinPaths(
              this.config.cwd ?? "./",
              this.config.root,
              "schema.graphql"
            ),
            filename: joinPaths("{builtinPath}", "graphql", "types.ts"),
            documents: [],
            config: {}
          })
        };
      },
      async configResolved() {
        this.dependencies.graphql = "latest";

        if (!this.config.graphql.schema) {
          throw new Error(
            'GraphQL schema is required. Please specify it in the plugin options or your Powerlines configuration under "graphql.schema".'
          );
        }

        if (!this.config.graphql.plugins?.length) {
          throw new Error(
            'GraphQL Codegen plugins are required. Please specify them in the plugin options or your Powerlines configuration under "graphql.plugins".'
          );
        }

        if (!this.config.graphql.pluginMap) {
          throw new Error(
            'GraphQL Codegen pluginMap is required. Please specify it in the plugin options or your Powerlines configuration under "graphql.pluginMap".'
          );
        }

        let document: GraphQLSchema | undefined;

        if (isSchema(this.config.graphql.schema)) {
          document = this.config.graphql.schema;
        } else {
          const schemaRef = (
            this.config.graphql.schema as URL | string
          ).toString();

          if (existsSync(schemaRef)) {
            const sdl = await this.fs.read(schemaRef);
            if (!sdl) {
              throw new Error(
                `Failed to read GraphQL schema from file: ${schemaRef}`
              );
            }

            document = buildSchema(sdl);
          } else {
            const response = await this.fetch(schemaRef);
            if (!response) {
              throw new Error(
                `Failed to fetch GraphQL schema from endpoint: ${schemaRef}`
              );
            }

            document = buildSchema(await response.text());
          }
        }

        this.config.graphql.filename = replacePathTokens(
          this,
          this.config.graphql.filename
        );
        this.config.graphql.document = document;

        const {
          schema: _schema,
          document: loadedDocument,
          filename,
          documents,
          plugins,
          pluginMap,
          config,
          ...rest
        } = this.config.graphql;

        this.config.powerplant = {
          ...generatorConfig,
          input: loadedDocument
        };

        this.powerplant.options = {
          ...rest,
          filename,
          documents: documents ?? [],
          plugins,
          pluginMap,
          config: config ?? {},
          schema: schemaToCodegenDocument(loadedDocument),
          schemaAst: loadedDocument
        } as TContext["powerplant"]["options"];
      }
    }
  ];
};

export default plugin;
