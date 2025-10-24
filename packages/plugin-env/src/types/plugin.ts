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

import { Children } from "@alloy-js/core/jsx-runtime";
import { Reflection } from "@powerlines/deepkit/types";
import {
  BabelPluginContext,
  BabelPluginOptions,
  BabelPluginResolvedConfig,
  BabelPluginUserConfig
} from "@powerlines/plugin-babel/types";
import type { DotenvParseOutput } from "@stryke/env/types";
import {
  DotenvConfiguration,
  TypeDefinition,
  TypeDefinitionParameter
} from "@stryke/types/configuration";
import { EnvInterface, SecretsInterface } from "./runtime";

export type EnvType = "env" | "secrets";

export type EnvPluginOptions = Omit<DotenvConfiguration, "types"> & {
  /**
   * A path to the type definition for the expected env configuration parameters. This value can include both a path to the typescript file and the name of the type definition to use separated by a `":"` or `"#"` character. For example: `"./src/types/env.ts#ConfigConfiguration"`.
   */
  types?: TypeDefinitionParameter;

  /**
   * A path to the type definition for the expected env secret parameters. This value can include both a path to the typescript file and the name of the type definition to use separated by a `":"` or `"#"` character. For example: `"./src/types/env.ts#ConfigSecrets"`.
   */
  secrets?: TypeDefinitionParameter;

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
   * @remarks
   * This option is set to `true` when building an application project.
   *
   * @defaultValue false
   */
  inject?: boolean;

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
};

export type EnvPluginUserConfig = BabelPluginUserConfig & {
  env: EnvPluginOptions;
};

export type EnvPluginResolvedConfig = BabelPluginResolvedConfig & {
  env: Required<Pick<DotenvConfiguration, "additionalFiles">> &
    Required<Pick<EnvPluginOptions, "defaultConfig">> & {
      /**
       * The type definition for the expected env variable parameters
       *
       * @remarks
       * This value is parsed from the {@link EnvPluginOptions.types} option.
       */
      types: TypeDefinition;

      /**
       * The type definition for the expected env secret parameters
       *
       * @remarks
       * This value is parsed from the {@link EnvPluginOptions.secrets} option.
       */
      secrets: TypeDefinition;

      /**
       * Should the plugin inject the env variables in the source code with their values?
       *
       * @remarks
       * This value is the result of reflecting the {@link EnvPluginOptions.inject} option.
       */
      inject: EnvPluginOptions["inject"];

      /**
       * The prefix used for environment variables
       *
       * @remarks
       * This value is used to filter environment variables that are loaded from the .env file and the process environment.
       */
      prefix: string[];
    };
};

export interface EnvPluginContext<
  TResolvedConfig extends EnvPluginResolvedConfig = EnvPluginResolvedConfig
> extends BabelPluginContext<TResolvedConfig> {
  env: {
    /**
     * The type definitions reflection for the env variables and secrets
     *
     * @remarks
     * These reflections contains the structure of the expected environment variables and secrets as defined by the type definitions provided in the plugin configuration.
     */
    types: {
      /**
       * The type definitions for the expected env variables
       */
      env: Reflection;

      /**
       * The type definitions for the expected env secrets
       */
      secrets: Reflection;
    };

    /**
     * The current **used** environment variables and secrets reflection
     *
     * @remarks
     * This reflection contains the structure of the current environment variables and secrets as defined during the plugin initialization by extracting the values from the source code.
     */
    used: {
      /**
       * The current env variables reflection
       */
      env: Reflection<EnvInterface>;

      /**
       * The current env secrets reflection
       */
      secrets: Reflection<SecretsInterface>;
    };

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
    injected: Reflection;
  };
}
