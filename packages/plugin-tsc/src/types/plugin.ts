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
import ts from "typescript";

export type TypeScriptCompilerPluginOptions = Partial<
  Omit<ts.TranspileOptions, "fileName">
> & {
  /**
   * Whether to perform type checking during the `lint` task.
   *
   * @defaultValue false
   */
  typeCheck?: boolean;
};

export interface TypeScriptCompilerPluginUserConfig extends UserConfig {
  transform: {
    /**
     * TypeScript Compiler transformation options
     */
    tsc: Partial<Omit<TypeScriptCompilerPluginOptions, "typeCheck">> &
      Required<Pick<TypeScriptCompilerPluginOptions, "typeCheck">>;
  };
}

export interface TypeScriptCompilerPluginResolvedConfig extends ResolvedConfig {
  transform: {
    /**
     * Resolved TypeScript Compiler transformation options
     */
    tsc: Partial<Omit<TypeScriptCompilerPluginOptions, "typeCheck">> &
      Required<Pick<TypeScriptCompilerPluginOptions, "typeCheck">>;
  };
}

export type TypeScriptCompilerPluginContext<
  TResolvedConfig extends TypeScriptCompilerPluginResolvedConfig =
    TypeScriptCompilerPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
