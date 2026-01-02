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

import alloy from "@powerlines/plugin-alloy";
import deepkit from "@powerlines/plugin-deepkit";
import plugin from "@powerlines/plugin-plugin";
import { defineConfig } from "powerlines";

export default defineConfig({
  skipCache: true,
  entry: [
    "src/index.tsx",
    "src/types/*.ts",
    "src/components/*.ts",
    "src/components/*.tsx"
  ],
  plugins: [
    plugin(),
    deepkit({
      reflectionLevel: "verbose"
    }),
    alloy({
      json: true,
      markdown: true
    })
  ]
  // build: {
  //   inputOptions: {
  //     transform: {
  //       typescript: {
  //         onlyRemoveTypeImports: true
  //       }
  //     }
  //   }
  // }
});
