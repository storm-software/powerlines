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

import { GeneratorOptions } from "@asyncapi/generator";
import { AsyncAPIDocument } from "@asyncapi/parser/esm/models/v3/asyncapi";
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export interface AsyncAPIPluginOptions {
  /**
   * The path to the AsyncAPI schema file.
   *
   * @remarks
   * This can be a string file path/remote URL string or a {@link URL} object.
   *
   * @defaultValue "\{projectRoot\}/schema.yaml"
   */
  schema?: string | URL | AsyncAPIDocument;

  /**
   * The name of the AsyncAPI template to use.
   *
   * @remarks
   * This can be a local path or a template package that will be installed by AsyncAPI.
   */
  templateName: string;

  /**
   * The target directory where the generated files will be written.
   *
   * @remarks
   * If using the default value, the files can be imported from "powerlines:asyncapi/fileName". This field allows the use of the "\{builtinPath\}" token to refer to the built-in Powerlines plugins directory - the value will be replaced with the correct file path by the plugin.
   *
   * @defaultValue "\{builtinPath\}/asyncapi"
   */
  outputPath?: string;

  /**
   * Name of the file to use as the entry point for the rendering process. Use in case you want to use only a specific template file. Note: this potentially avoids rendering every file in the template.
   */
  entrypoint?: string;

  /**
   * Template parameters to pass to the AsyncAPI generator.
   */
  templateParams?: Record<string, any>;

  /**
   * Glob patterns to prevent overwriting specific files.
   */
  noOverwriteGlobs?: string[];

  /**
   * Object with hooks to disable. The key is a hook type. If key has "true" value, then the generator skips all hooks from the given type. If the value associated with a key is a string with the name of a single hook, then the generator skips only this single hook name. If the value associated with a key is an array of strings, then the generator skips only hooks from the array.
   */
  disabledHooks?: Record<string, boolean | string | string[]>;

  /**
   * The registry to use for installing templates/dependencies.
   *
   * @remarks
   * If no value is provided, the default registry configured for the repository will be used.
   */
  registry?: string | { url: string; auth?: string; token?: string };

  /**
   * Whether to force write files even if they exist.
   *
   * @defaultValue true
   */
  forceWrite?: boolean;

  /**
   * Whether to enable debug mode.
   *
   * @remarks
   * When no value is provided, if `mode` is "development" or `logLevel` is "debug" or "trace", debug mode will be enabled by default.
   *
   * @defaultValue false
   */
  debug?: boolean;

  /**
   * Whether to compile the template before generating files.
   *
   * @defaultValue false
   */
  compile?: boolean;

  /**
   * Optional parameter to map schema references from a base url to a local base folder e.g. url=https://schema.example.com/crm/  folder=./test/docs/ .
   */
  mapBaseUrlToFolder?: Record<string, string>;
}

export type AsyncAPIPluginUserConfig = UserConfig & {
  asyncapi?: GeneratorOptions &
    Required<
      Pick<AsyncAPIPluginOptions, "schema" | "templateName" | "outputPath">
    >;
};

export type AsyncAPIPluginResolvedConfig = ResolvedConfig & {
  asyncapi: GeneratorOptions &
    Required<
      Pick<AsyncAPIPluginOptions, "schema" | "templateName" | "outputPath">
    > & {
      document: string | AsyncAPIDocument;
    };
};

export type AsyncAPIPluginContext<
  TResolvedConfig extends
    AsyncAPIPluginResolvedConfig = AsyncAPIPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
