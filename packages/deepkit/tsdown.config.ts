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
    name: "deepkit",
    entry: ["src/vendor/**/*.ts", "src/*.ts"],
    clean: false,
    unbundle: false,
    exports: false,
    deps: {
      skipNodeModulesBundle: false,
      alwaysBundle: [
        "@deepkit/core",
        "@deepkit/type",
        "@deepkit/type-spec",
        "@deepkit/type-compiler"
      ]
    }
  }
  // {
  //   name: "deepkit-compiler",
  //   entry: ["src/vendor/type-compiler/**/*.ts"],
  //   outDir: "dist/vendor/type-compiler",
  //   platform: "node",
  //   target: "esnext",
  //   clean: false,
  //   exports: false,
  //   unbundle: false,
  //   dts: true,
  //   deps: {
  //     skipNodeModulesBundle: false,
  //     alwaysBundle: ["@deepkit/type-compiler"]
  //   }
  // },
  // {
  //   name: "deepkit",
  //   entry: ["src/*.ts"],
  //   outDir: "dist",
  //   platform: "node",
  //   target: "esnext",
  //   clean: false,
  //   exports: false,
  //   unbundle: false,
  //   dts: true,
  //   deps: {
  //     skipNodeModulesBundle: true,
  //     neverBundle: [
  //       "@powerlines/deepkit/vendor/core",
  //       "@powerlines/deepkit/vendor/type",
  //       "@powerlines/deepkit/vendor/type-spec",
  //       "@powerlines/deepkit/vendor/type-compiler",
  //       "@powerlines/deepkit/vendor/type-compiler/compiler",
  //       "@powerlines/deepkit/vendor/type-compiler/config"
  //     ]
  //   }
  // }
]);

export default config;
