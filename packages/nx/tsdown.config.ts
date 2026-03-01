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
    name: "nx",
    entry: [
      "./index.ts",
      "./executors.ts",
      "./generators.ts",
      "./src/base/*.ts",
      "./src/types/*.ts",
      "./src/helpers/*.ts",
      "./src/plugin/index.ts",
      "./src/executors/*/executor.ts",
      "./src/executors/*/untyped.ts",
      "./src/generators/*/generator.ts",
      "./src/generators/*/untyped.ts"
    ],
    unbundle: false,
    exports: false,
    external: ["powerlines"]
  }
]);

export default config;
