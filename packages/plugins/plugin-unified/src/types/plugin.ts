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

import type { FilterPattern } from "@rollup/pluginutils";
import { MaybePromise } from "@stryke/types";
import { PluginContext, ResolvedConfig, UserConfig } from "powerlines";
import type { SourceMap } from "rollup";
import type { Processor } from "unified";

export interface UnifiedRule {
  /**
   * Include filter, accepts glob patterns, RegExp or a function.
   *
   * @remarks
   * The following rules apply to the {@link include} and {@link exclude} options:
   * If a function is provided, it will be called with the id of the file and should return a boolean indicating whether the rule should be applied.
   * If a glob pattern or RegExp is provided, it will be used to create a filter function using `@rollup/pluginutils`'s `createFilter` function.
   * If {@link include} is a function, the {@link exclude} option will be ignored.
   * If {@link include} is not a function, the {@link exclude} option can be used to exclude files from being processed by this rule.
   * If neither {@link include} nor {@link exclude} is provided, the rule will be applied to all files.
   */
  include: FilterPattern | ((id: string) => boolean);

  /**
   * Exclude filter, accepts glob patterns, RegExp or a function.
   *
   * @remarks
   * The following rules apply to the {@link include} and {@link exclude} options:
   * If a function is provided, it will be called with the id of the file and should return a boolean indicating whether the rule should be applied.
   * If a glob pattern or RegExp is provided, it will be used to create a filter function using `@rollup/pluginutils`'s `createFilter` function.
   * If {@link include} is a function, the {@link exclude} option will be ignored.
   * If {@link include} is not a function, the {@link exclude} option can be used to exclude files from being processed by this rule.
   * If neither {@link include} nor {@link exclude} is provided, the rule will be applied to all files.
   *
   * @see https://rollupjs.org/guide/en/#plugincontext
   */
  exclude?: FilterPattern;

  /**
   * Enforce the rule to be applied the in the build pipeline
   *
   * @see https://github.com/unjs/unplugin#hooks
   */
  enforce?: "pre" | "post" | undefined;

  /**
   * Setup the unified processor
   */
  setup: (
    unified: Processor
  ) => MaybePromise<Processor<any, any, any, any, any>>;

  /**
   * Additional string transforms
   */
  transform?: {
    /**
     * Preprocess the raw code before unified process
     */
    pre?: (code: string, id: string) => MaybePromise<string | void>;

    /**
     * Postprocess the unified result.
     * If a sourcemap is returned, the function is responsible for merging it with the unified result.
     */
    post?: (
      code: string,
      id: string,
      map?: SourceMap
    ) => MaybePromise<string | void | { code: string; map?: SourceMap | null }>;
  };
}

export interface UnifiedPluginOptions {
  rules?: UnifiedRule[];
}

export type UnifiedPluginUserConfig = UserConfig & {
  unified?: UnifiedPluginOptions;
};

export interface ResolvedUnifiedRule extends UnifiedRule {
  filter: (id: string) => boolean;
  processor: Promise<Processor>;
}

export type UnifiedPluginResolvedConfig = ResolvedConfig & {
  unified: {
    rules: ResolvedUnifiedRule[];
  };
};

export type UnifiedPluginContext<
  TResolvedConfig extends UnifiedPluginResolvedConfig =
    UnifiedPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
