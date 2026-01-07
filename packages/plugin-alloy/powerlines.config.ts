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

import alloy from "@alloy-js/rollup-plugin";
import plugin from "@powerlines/plugin-plugin";
import { defineConfig } from "powerlines";

export default defineConfig({
  skipCache: true,
  entry: [
    "src/index.tsx",
    "src/{core,helpers,markdown,typescript,types}/**/*.ts",
    "src/{core,helpers,markdown,typescript,types}/**/*.tsx"
  ],
  plugins: [plugin()],
  build: {
    inputOptions: {
      transform: {
        jsx: {
          runtime: "classic",
          pragma: "Alloy.createElement",
          pragmaFrag: "Alloy.Fragment",
          importSource: "@alloy-js/core"
        }
      }
    },
    plugins: [alloy()]
  }
});
