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

import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";
import { Application, ProjectReflection, TypeDocOptions } from "typedoc";

export interface GenerateDocsOptions {
  frontmatter?: Record<string, any>;
  outputPath?: string;
  project: ProjectReflection;
}

export interface TypeDocPluginOptions
  extends Partial<Omit<TypeDocOptions, "out">> {
  /**
   * The output path for the generated documentation.
   *
   * @defaultValue "docs/generated/api-reference"
   */
  outputPath?: string;

  /**
   * The base URL for the documentation site.
   *
   * @defaultValue "/docs/"
   */
  basePath?: string;

  /**
   * Options to be passed to the TypeDoc generator.
   *
   * @remarks
   * These options will be override any other values passed to the TypeDoc generator.
   */
  override?: Partial<TypeDocOptions>;
}

export interface TypeDocPluginUserConfig extends UserConfig {
  /**
   * Options for the TypeDoc plugin.
   */
  docs?: {
    typedoc: TypeDocPluginOptions;
  };
}

export interface TypeDocPluginResolvedConfig extends ResolvedConfig {
  /**
   * Options for the TypeDoc plugin.
   */
  docs: {
    typedoc: TypeDocOptions & {
      outputPath: string;
      baseUrl: string;
      override?: Partial<TypeDocOptions>;
    };
  };
}

export type TypeDocPluginContext<
  TResolvedConfig extends
    TypeDocPluginResolvedConfig = TypeDocPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  /**
   * The initialized TypeDoc application.
   */
  typedoc: Application;
};
