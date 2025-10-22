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

import { createUnplugin } from "powerlines/lib/unplugin";
import { createRspackPlugin as createRspackUnplugin } from "unplugin";
import { RspackPluginContext } from "../types/plugin";

export function createRspackPlugin(context: RspackPluginContext) {
  return createRspackUnplugin(
    createUnplugin(context, {
      skipResolve: true
    })
  )({});
}
