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

import type { Options as PowerPlantGraphQLCodegenOptions } from "@power-plant/graphql-codegen";
import type {
  PowerPlantPluginContext,
  PowerPlantPluginResolvedConfig
} from "@powerlines/plugin-power-plant/types/plugin";
import type { GraphQLSchema } from "graphql";
import type { ResolvedConfig, UserConfig } from "powerlines";

export type { Options as PowerPlantGraphQLCodegenOptions } from "@power-plant/graphql-codegen";

/**
 * Options for the GraphQL Powerlines plugin.
 */
export type GraphQLPluginOptions = Partial<
  Omit<PowerPlantGraphQLCodegenOptions, "schema" | "schemaAst">
> & {
  /**
   * The GraphQL schema to generate from.
   *
   * @remarks
   * This can be a {@link GraphQLSchema} instance, a local file path, a remote URL
   * string, or a {@link URL} object.
   *
   * @defaultValue "\{projectRoot\}/schema.graphql"
   */
  schema?: string | URL | GraphQLSchema;
};

export type GraphQLPluginUserConfig = UserConfig & {
  graphql?: GraphQLPluginOptions;
};

export type GraphQLPluginResolvedConfig = ResolvedConfig &
  PowerPlantPluginResolvedConfig<
    GraphQLSchema,
    PowerPlantGraphQLCodegenOptions
  > & {
    graphql: Omit<GraphQLPluginOptions, "schema" | "filename"> & {
      schema: string | URL | GraphQLSchema;
      filename: string;
      document: GraphQLSchema;
    };
  };

export type GraphQLPluginContext<
  TResolvedConfig extends GraphQLPluginResolvedConfig =
    GraphQLPluginResolvedConfig
> = PowerPlantPluginContext<
  GraphQLSchema,
  PowerPlantGraphQLCodegenOptions,
  TResolvedConfig
>;
