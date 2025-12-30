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
          importSource: "@powerlines/plugin-alloy/vendor"
        }
      }
    },
    plugins: [alloy()],
    unbundle: true,
    minify: false,
    skipNodeModulesBundle: true,
    alias: {
      "@deepkit/core": "@powerlines/deepkit/vendor/core",
      "@deepkit/type": "@powerlines/deepkit/vendor/type",
      "@deepkit/type-spec": "@powerlines/deepkit/vendor/type-spec",
      "@deepkit/type-compiler": "@powerlines/deepkit/vendor/type-compiler",
      "@deepkit/type-compiler/compiler":
        "@powerlines/deepkit/vendor/type-compiler/compiler",
      "@deepkit/type-compiler/config":
        "@powerlines/deepkit/vendor/type-compiler/config"
    },
    external: [
      "@powerlines/deepkit",
      "@powerlines/plugin-alloy/vendor",
      "@powerlines/plugin-alloy/vendor/jsx-runtime"
    ]
  }
});
