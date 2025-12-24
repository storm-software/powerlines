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

import alloyPlugin from "@alloy-js/rollup-plugin";
import plugin from "@powerlines/plugin-plugin";
import babelPlugin from "@rollup/plugin-babel";
import { defineConfig } from "powerlines";

export default defineConfig({
  skipCache: true,
  entry: ["src/index.tsx"],
  plugins: [plugin()],
  build: {
    noExternal: ["@vue/reactivity"],
    external: [
      "@powerlines/deepkit/vendor/type",
      "@powerlines/deepkit/vendor/core",
      "@powerlines/deepkit/vendor/type-spec"
    ],
    plugins: [
      babelPlugin({
        babelHelpers: "bundled",
        parserOpts: {
          sourceType: "module",
          plugins: ["jsx", "typescript"]
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }),
      alloyPlugin()
    ]
  }
});
