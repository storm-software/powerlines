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
import { Unimport, UnimportOptions } from "unimport";

export type UnimportContext = Unimport & {
  lastImportsDump?: string;
  dumpImports: () => Promise<void>;
};

export type UnimportPluginOptions = Partial<Omit<UnimportOptions, "presets">> &
  Required<Pick<UnimportOptions, "presets">> & {
    /**
     * Custom magic comments to be opt-out for auto import, per file/module
     *
     * @defaultValue ["@unimport-disable", "@unimport-ignore", "@imports-disable", "@imports-ignore", "@powerlines-disable", "@powerlines-ignore"]
     */
    commentsDisable?: string[];

    /**
     * Custom magic comments to debug auto import, printed to console
     *
     * @defaultValue ["@unimport-debug", "@imports-debug", "@powerlines-debug"]
     */
    commentsDebug?: string[];
  };

export type UnimportPluginUserConfig = UserConfig & {
  unimport?: UnimportPluginOptions;
};

export type UnimportPluginResolvedConfig = ResolvedConfig & {
  unimport: UnimportPluginOptions;
};

export type UnimportPluginContext<
  TResolvedConfig extends
    UnimportPluginResolvedConfig = UnimportPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  unimport: UnimportContext;
};
