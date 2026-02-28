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

import { defineTSDownConfig } from "@powerlines/tools-config/tsdown.config";

const config = defineTSDownConfig([
  {
    name: "powerlines",
    entry: [
      "src/index.ts",
      "src/astro.ts",
      "src/config.ts",
      "src/esbuild.ts",
      "src/farm.ts",
      "src/next.ts",
      "src/nuxt.ts",
      "src/plugin-utils.ts",
      "src/rolldown.ts",
      "src/rollup.ts",
      "src/rspack.ts",
      "src/tsdown.ts",
      "src/tsup.ts",
      "src/unloader.ts",
      "src/unplugin.ts",
      "src/utils.ts",
      "src/vite.ts",
      "src/webpack.ts",
      "src/storage/index.ts",
      "src/context/index.ts",
      "src/typescript/index.ts"
    ],
    external: [
      "@powerlines/plugin-unbuild",
      "@powerlines/plugin-esbuild",
      "@powerlines/plugin-rollup",
      "@powerlines/plugin-rolldown",
      "@powerlines/plugin-rspack",
      "@powerlines/plugin-tsdown",
      "@powerlines/plugin-tsup",
      "@powerlines/plugin-vite",
      "@powerlines/plugin-webpack"
    ]
  }
]);

export default config;
