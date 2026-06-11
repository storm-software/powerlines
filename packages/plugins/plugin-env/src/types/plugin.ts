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

import { Children } from "@alloy-js/core";
import { AutoMDPluginOptions } from "@powerlines/plugin-automd/types/plugin";
import {
  BabelPluginContext,
  BabelPluginOptions,
  BabelPluginResolvedConfig,
  BabelPluginUserConfig
} from "@powerlines/plugin-babel/types";
import type { JsonSchemaObject, Schema, SchemaInput } from "@powerlines/schema";
import type { DotenvParseOutput } from "@stryke/env/types";
import { RequiredKeys } from "@stryke/types";
import { DotenvConfiguration } from "@stryke/types/configuration";

export type EnvType = "env" | "secrets";

export type EnvPluginOptions = Omit<DotenvConfiguration, "types"> & {
  /**
   * A path to the type definition for the expected env configuration parameters. This value can include both a path to the typescript file and the name of the type definition to use separated by a `":"` or `"#"` character. For example: `"./src/types/env.ts#ConfigConfiguration"`.
   */
  config?: SchemaInput;

  /**
   * A path to the type definition for the expected env secret parameters. This value can include both a path to the typescript file and the name of the type definition to use separated by a `":"` or `"#"` character. For example: `"./src/types/env.ts#ConfigSecrets"`.
   */
  secrets?: SchemaInput;

  /**
   * An additional prefix (or list of additional prefixes) to apply to the environment variables
   *
   * @remarks
   * By default, the plugin will use the `POWERLINES_` prefix. This option is useful for avoiding conflicts with other environment variables.
   */
  prefix?: string | string[];

  /**
   * Should the plugin inject the env variables in the source code with their values?
   *
   * @defaultValue false
   */
  inject?: boolean;

  /**
   * Should the plugin validate the loaded environment variables against the provided type definitions?
   *
   * @defaultValue false
   */
  validate?: boolean;

  /**
   * The default configuration to use when loading environment variables.
   *
   * @remarks
   * This configuration is used as the base configuration when loading environment variables, and will be overridden by any values found in the `.env` file or the process environment.
   */
  defaultConfig?: Children;

  /**
   * Babel configuration options to use when injecting environment variables into the source code.
   *
   * @remarks
   * This option allows you to customize the Babel transformation process used to inject environment variables into the source code. If not provided, the plugin will use default Babel settings.
   */
  babel?: BabelPluginOptions;

  /**
   * AutoMD configuration options to allow injecting environment variables documentation into a markdown file such as a README.md.
   *
   * @remarks
   * The README.md file should contain the `<!-- automd:env --><!-- /automd -->` comment block where the documentation will be injected.
   */
  automd?: AutoMDPluginOptions;
};

export type EnvPluginUserConfig = BabelPluginUserConfig & {
  env: EnvPluginOptions;
};

export type EnvPluginResolvedConfig = BabelPluginResolvedConfig & {
  env: Required<Pick<DotenvConfiguration, "additionalFiles">> &
    RequiredKeys<EnvPluginOptions, "config" | "secrets" | "defaultConfig"> & {
      /**
       * Should the plugin inject the env variables in the source code with their values?
       *
       * @remarks
       * This value is the result of reflecting the {@link EnvPluginOptions.inject} option.
       */
      inject: boolean;

      /**
       * Should the plugin validate the loaded environment variables against the provided type definitions?
       *
       * @remarks
       * This value is the result of reflecting the {@link EnvPluginOptions.validate} option.
       */
      validate: boolean;

      /**
       * The prefix used for environment variables
       *
       * @remarks
       * This value is used to filter environment variables that are loaded from the .env file and the process environment.
       */
      prefix: string[];
    };
};

/**
 * The schema for environment variables and secrets used by the plugin.
 *
 * @remarks
 * This schema is the result of parsing the type definitions provided in the {@link EnvPluginOptions.config} and {@link EnvPluginOptions.secrets} options, and is used to validate the loaded environment variables and secrets, as well as to determine which variables should be injected into the source code when the {@link EnvPluginOptions.inject} option is enabled.
 */
export type EnvSchema = Schema<JsonSchemaObject> & {
  /**
   * The list of active environment variables or secrets that should be injected into the source code when the {@link EnvPluginOptions.inject} option is enabled. This list is determined by filtering the properties defined in the schema based on the provided prefix and any additional filtering criteria defined in the type definition, such as an `active` property.
   *
   * @remarks
   * If the type definition includes an `active` property for each environment variable or secret, this list will be determined by including only the variables or secrets that have `active` set to `true`. If the type definition does not include an `active` property, all variables or secrets defined in the schema that match the provided prefix will be included in this list.
   */
  active: string[];
};

export interface EnvPluginContext<
  TResolvedConfig extends EnvPluginResolvedConfig = EnvPluginResolvedConfig
> extends BabelPluginContext<TResolvedConfig> {
  env: {
    /**
     * The type definition for the expected env variable parameters
     *
     * @remarks
     * This value is parsed from the {@link EnvPluginOptions.config} option.
     */
    config: EnvSchema;

    /**
     * The type definition for the expected env secret parameters
     *
     * @remarks
     * This value is parsed from the {@link EnvPluginOptions.secrets} option.
     */
    secrets: EnvSchema;

    /**
     * The parsed .env configuration object
     *
     * @remarks
     * This value is the result of loading the .env configuration file found in the project root directory and merging it with the values provided at {@link EnvPluginOptions.values}
     */
    parsed: DotenvParseOutput;

    /**
     * The injected environment variables and secrets reflection
     *
     * @remarks
     * This reflection contains the structure of the injected environment variables and secrets that were injected into the source code during the build process.
     */
    injected: string[];
  };
}
