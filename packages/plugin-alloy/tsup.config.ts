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

import { defineTsupConfig } from "@powerlines/tools-config/tsup.shared";

const config = defineTsupConfig([
  {
    name: "vendor",
    entry: ["src/vendor.ts"],
    outDir: "dist",
    clean: false,
    skipNodeModulesBundle: false,
    noExternal: ["@alloy-js/core", "@vue/reactivity", "@vue/shared"]
  }
]);

export default config;
