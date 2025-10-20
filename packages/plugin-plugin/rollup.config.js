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

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";
import typescriptPlugin from "rollup-plugin-typescript2";

const externals = [
  "@powerlines/",
  "@storm-software/",
  "@stryke/",
  "@alloy-js/",
  "@babel/",
  "lru-cache",
  "picocolors",
  "chalk",
  "cli-table3",
  "defu",
  "pathe",
  "yaml",
  "prettier",
  "prettier/doc.js",
  "fs",
  "fs/promises",
  "v8",
  "module"
];

/** @type {import('rollup').Config[]} */
export default [
  {
    jsx: "preserve",
    external: id =>
      externals.includes(id) || externals.some(ext => id.startsWith(ext)),
    input: Object.fromEntries(
      globSync("src/**/{*.tsx,*.ts}").map(file => [
        file.slice(0, file.length - path.extname(file).length),
        fileURLToPath(new URL(file, import.meta.url))
      ])
    ),
    output: {
      dir: "dist",
      format: "es",
      preserveModules: true,
      entryFileNames: "[name].js",
      sourceMap: true
    },
    plugins: [
      typescriptPlugin({
        check: false,
        tsconfig: "./tsconfig.json"
      }),
      // alloyPlugin(),
      resolve({
        moduleDirectories: ["node_modules"],
        preferBuiltins: true
      })
    ]
  },
  {
    jsx: "preserve",
    external: id =>
      externals.includes(id) || externals.some(ext => id.startsWith(ext)),
    input: Object.fromEntries(
      globSync("src/**/{*.tsx,*.ts}").map(file => [
        file.slice(0, file.length - path.extname(file).length),
        fileURLToPath(new URL(file, import.meta.url))
      ])
    ),
    output: {
      dir: "dist",
      format: "cjs",
      preserveModules: true,
      entryFileNames: "[name].cjs",
      sourceMap: true
    },
    plugins: [
      typescriptPlugin({
        check: false,
        tsconfig: "./tsconfig.json"
      }),
      // alloyPlugin(),
      resolve({
        moduleDirectories: ["node_modules"],
        preferBuiltins: true
      }),
      commonjs()
    ]
  }
];
