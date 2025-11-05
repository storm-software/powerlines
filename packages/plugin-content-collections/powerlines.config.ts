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

import plugin from "@powerlines/plugin-plugin";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  skipCache: true,
  entry: ["src/index.ts", "src/types/*.ts", "src/helpers/*.ts"],
  plugins: [
    plugin({
      alloy: false
    })
  ],
  noExternal: ["@content-collections/core"]
});
