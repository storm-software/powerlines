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
import { defineConfig } from "../powerlines/src/index";

export default defineConfig({
  skipCache: true,
  entry: ["src/**/*.ts", "src/**/*.tsx"],
  plugins: [plugin()],
  build: {
    noExternal: ["@vue/reactivity", "@alloy-js/core"],
    external: [
      "@alloy-js/rollup-plugin",
      "@alloy-js/typescript",
      "@alloy-js/json",
      "@alloy-js/markdown",
      "@powerlines/deepkit/vendor/type",
      "@powerlines/deepkit/vendor/core",
      "@powerlines/deepkit/vendor/type-spec"
    ],
    inputOptions: {
      transform: {
        jsx: {
          runtime: "classic",
          pragma: "Alloy.createElement",
          importSource: "@alloy-js/core"
        }
      }
    },
    plugins: [alloy()],
    unbundle: false,
    minify: false
  }
});
