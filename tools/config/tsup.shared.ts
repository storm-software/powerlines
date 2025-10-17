/* -------------------------------------------------------------------

            ⚡ Storm Software - Monorepo Template

 This code was released as part of the Monorepo Template project. Monorepo Template
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/monorepo-template
 Documentation:   https://stormsoftware.com/projects/monorepo-template/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/monorepo-template/license

 ------------------------------------------------------------------- */

import type { Options } from "tsup";
import { defineConfig } from "tsup";

export const getTsupConfig = (
  options: Partial<Options> & Pick<Options, "name" | "entryPoints">
) =>
  defineConfig({
    target: "node22",
    outDir: "dist",
    format: ["cjs", "esm"],
    bundle: true,
    splitting: true,
    treeshake: true,
    keepNames: true,
    clean: true,
    sourcemap: false,
    platform: "node",
    tsconfig: "./tsconfig.json",
    dts: {
      resolve: true
    },
    onSuccess: async () => {
      // eslint-disable-next-line no-console
      console.log(`${options.name} build completed successfully!`);
    },
    ...options
  });
