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
    name: "core",
    entry: ["src/*.ts", "src/types/*.ts"],
    outDir: "dist",
    clean: false,
    sourcemap: true,
    minify: false,
    skipNodeModulesBundle: true
  },
  {
    name: "core-lib",
    entry: [
      "src/lib/*.ts",
      "src/lib/fs/*.ts",
      "src/lib/fs/storage/*.ts",
      "src/lib/contexts/*.ts",
      "src/lib/build/*.ts",
      "src/lib/typescript/*.ts",
      "src/lib/unplugin/*.ts",
      "src/lib/utilities/*.ts"
    ],
    outDir: "dist/lib",
    clean: false,
    sourcemap: true,
    minify: false,
    skipNodeModulesBundle: true
  },
  {
    name: "core-plugin-utils",
    entry: ["src/plugin-utils/*.ts"],
    outDir: "dist/plugin-utils",
    clean: false,
    sourcemap: true,
    minify: false,
    skipNodeModulesBundle: true
  }
]);

export default config;
