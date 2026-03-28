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

import babel from "@powerlines/plugin-babel";
import plugin from "@powerlines/plugin-plugin";
import { findFileExtension } from "@stryke/path/file-path-fns";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  skipCache: true,
  input: [
    "src/index.tsx",
    "src/render.tsx",
    "src/core/**/*.{ts,tsx}",
    "src/hcl/**/*.{ts,tsx}",
    "src/helpers/**/*.{ts,tsx}",
    "src/markdown/**/*.{ts,tsx}",
    "src/types/**/*.{ts,tsx}",
    "src/typescript/**/*.{ts,tsx}",
    "src/yaml/**/*.{ts,tsx}"
  ],
  plugins: [plugin(), babel()],
  resolve: {
    external: [
      "@alloy-js/core",
      "@alloy-js/typescript",
      "@alloy-js/json",
      "@alloy-js/markdown"
    ]
  },
  babel: {
    presets: [
      [
        "@alloy-js/babel-preset",
        {},
        (_: string, id: string) =>
          findFileExtension(id) === "tsx" || findFileExtension(id) === "jsx"
      ]
    ]
  },
  tsdown: {
    inputOptions: {
      transform: {
        jsx: "preserve"
      }
    }
  }
});
