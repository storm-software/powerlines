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

import { Cache } from "powerlines/deepkit/type-compiler";
import { ReflectionConfig } from "powerlines/deepkit/type-compiler/config";
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";
import ts from "typescript";

export type DeepkitPluginOptions = Partial<ReflectionConfig>;

export interface DeepkitPluginUserConfig extends UserConfig {
  transform: {
    /**
     * Deepkit transformation options
     */
    deepkit: DeepkitPluginOptions;
  };
}

export interface DeepkitPluginResolvedConfig extends ResolvedConfig {
  transform: {
    /**
     * Resolved deepkit transformation options
     */
    deepkit: Required<DeepkitPluginOptions>;
  };
}

export type DeepkitPluginContext<
  TResolvedConfig extends
    DeepkitPluginResolvedConfig = DeepkitPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  deepkit: {
    /**
     * Type Compiler Cache Instance
     */
    cache: Cache;

    /**
     * Deepkit - TypeScript Transformer Factory
     */
    transformer: ts.CustomTransformerFactory;

    /**
     * Deepkit - TypeScript Declaration Transformer Factory
     */
    declarationTransformer: ts.CustomTransformerFactory;
  };
};
