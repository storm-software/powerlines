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
    name: "engine-core",
    entry: [
      "src/index.ts",
      "src/engine.ts",
      "src/api/*.ts",
      "src/helpers/*.ts",
      "src/context/index.ts"
    ],
    unbundle: false,
    exports: false
  },
  {
    name: "engine-worker",
    format: ["cjs", "esm"],
    target: "node24",
    entry: "src/execution-host.ts",
    outDir: "dist/worker",
    unbundle: false,
    exports: false
  }
]);

export default config;
