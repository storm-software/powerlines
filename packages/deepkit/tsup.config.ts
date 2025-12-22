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
    name: "deepkit",
    entry: [
      "src/vendor/type.ts",
      "src/vendor/type-spec.ts",
      "src/vendor/core.ts"
    ],
    outDir: "dist/vendor",
    platform: "neutral",
    target: "esnext",
    clean: false,
    noExternal: ["@deepkit/core", "@deepkit/type", "@deepkit/type-spec"]
  },
  {
    name: "deepkit-compiler",
    entry: ["src/vendor/type-compiler/**/*.ts"],
    outDir: "dist/vendor",
    platform: "node",
    target: "esnext",
    clean: false,
    skipNodeModulesBundle: true,
    noExternal: [
      "@deepkit/core",
      "@deepkit/type",
      "@deepkit/type-spec",
      "@deepkit/type-compiler"
    ]
  },
  {
    name: "deepkit",
    entry: ["src/*.ts"],
    outDir: "dist",
    platform: "node",
    target: "esnext",
    clean: false,
    skipNodeModulesBundle: true,
    external: [
      "@powerlines/deepkit/vendor/type",
      "@powerlines/deepkit/vendor/type-compiler",
      "@powerlines/deepkit/vendor/type-spec",
      "@powerlines/deepkit/vendor/core"
    ]
  }
]);

export default config;
