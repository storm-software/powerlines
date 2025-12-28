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

import alloyPlugin from "@alloy-js/babel-plugin";
import jsxDomExpressionsPlugin from "@alloy-js/babel-plugin-jsx-dom-expressions";
import transformTypescriptPlugin from "@babel/plugin-transform-typescript";
import babel from "@powerlines/plugin-babel";
import plugin from "@powerlines/plugin-plugin";
import { defineConfig } from "powerlines";

export default defineConfig({
  skipCache: true,
  entry: ["src/**/*.ts", "src/**/*.tsx"],
  plugins: [
    babel({
      plugins: [
        [
          alloyPlugin,
          {
            alloyModuleName: "@alloy-js/core"
          }
        ],
        [
          jsxDomExpressionsPlugin,
          {
            alloyModuleName: "@alloy-js/core",
            moduleName: "@alloy-js/core/jsx-runtime",
            generate: "universal",
            wrapConditionals: true,
            preserveWhitespace: true
          }
        ],
        [
          transformTypescriptPlugin,
          {
            allowDeclareFields: true,
            isTSX: true
          }
        ]
      ]
    }),
    plugin()
  ],
  build: {
    noExternal: ["@vue/reactivity"],
    external: [
      "@powerlines/deepkit/vendor/type",
      "@powerlines/deepkit/vendor/core",
      "@powerlines/deepkit/vendor/type-spec"
    ],
    inputOptions: {
      transform: {
        jsx: "react-jsx"
      }
    },
    unbundle: false,
    minify: false
  }
});
