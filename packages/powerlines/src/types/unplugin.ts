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

import type {
  UnpluginContextMeta,
  UnpluginFactory,
  UnpluginOptions
} from "unplugin";
import type {
  BuildVariant,
  InferUnpluginVariant,
  UnpluginBuildVariant
} from "./build";
import type { InferUserConfig } from "./config";
import type { PluginContext } from "./context";
import type { BuildPlugin } from "./plugin";
import type { InferResolvedConfig } from "./resolved";

export type InferUnpluginOptions<TBuildVariant extends BuildVariant> =
  UnpluginOptions & {
    [TKey in InferUnpluginVariant<TBuildVariant>]: BuildPlugin<
      PluginContext<InferResolvedConfig<TBuildVariant>>,
      TKey
    >;
  };

export type UnpluginUserConfig<TBuildVariant extends BuildVariant | undefined> =
  InferUserConfig<TBuildVariant> & {
    /**
     * The meta information for the unplugin context
     */
    unplugin: UnpluginContextMeta;
  };

export type StormStackUnpluginFactory<
  TBuildVariant extends UnpluginBuildVariant
> = UnpluginFactory<Partial<InferUserConfig<TBuildVariant>>, false>;
