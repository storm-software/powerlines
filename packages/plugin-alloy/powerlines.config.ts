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

import rollupPlugin from "@alloy-js/rollup-plugin";
import plugin from "@powerlines/plugin-plugin";
import { defineConfig } from "powerlines";

export default defineConfig({
  skipCache: true,
  entry: [
    "src/index.tsx",
    "src/core/**/*.{ts,tsx}",
    "src/helpers/**/*.{ts,tsx}",
    "src/markdown/**/*.{ts,tsx}",
    "src/types/**/*.{ts,tsx}",
    "src/typescript/**/*.{ts,tsx}"
  ],
  plugins: [plugin()],
  build: {
    inputOptions: {
      transform: {
        jsx: "preserve"
      }
    },
    plugins: [rollupPlugin()],
    external: [
      "@alloy-js/core",
      "@alloy-js/typescript",
      "@alloy-js/json",
      "@alloy-js/markdown"
    ],
    noExternal: ["unctx"]
  }
});
