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
    entry: ["src/*.ts", "src/internal/api.ts", "src/types/*.ts"],
    outDir: "dist",
    clean: false,
    sourcemap: true,
    external: [
      "powerlines/deepkit/core",
      "powerlines/deepkit/type-compiler",
      "powerlines/deepkit/type-spec",
      "powerlines/deepkit/type"
    ],
    skipNodeModulesBundle: true
  },
  {
    name: "core-lib",
    entry: [
      "src/lib/*.ts",
      "src/lib/build/*.ts",
      "src/lib/deepkit/*.ts",
      "src/lib/typedoc/*.ts",
      "src/lib/typedoc/helpers/*.ts",
      "src/lib/typescript/*.ts",
      "src/lib/unplugin/*.ts",
      "src/lib/utilities/*.ts"
    ],
    outDir: "dist/lib",
    clean: false,
    skipNodeModulesBundle: true,
    sourcemap: true,
    external: [
      "powerlines/deepkit/core",
      "powerlines/deepkit/type-compiler",
      "powerlines/deepkit/type-spec",
      "powerlines/deepkit/type"
    ]
  },
  {
    name: "core-deepkit-libs",
    entry: [
      "src/deepkit/type.ts",
      "src/deepkit/type-spec.ts",
      "src/deepkit/core.ts"
    ],
    outDir: "dist/deepkit",
    platform: "neutral",
    target: "esnext",
    sourcemap: true,
    clean: false,
    noExternal: ["@deepkit/core", "@deepkit/type", "@deepkit/type-spec"]
  },
  {
    name: "core-deepkit-compiler",
    entry: ["src/deepkit/type-compiler/**/*.ts"],
    outDir: "dist/deepkit",
    platform: "node",
    target: "esnext",
    clean: false,
    sourcemap: true,
    noExternal: ["@deepkit/type-compiler"]
  }
]);

export default config;
