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

/**
 * A list of Nx input strings that describe the Powerlines configuration file
 */
export const CONFIG_INPUTS = [
  "{projectRoot}/package.json",
  "{projectRoot}/powerlines.json",
  "{projectRoot}/powerlines.*.json",
  "{projectRoot}/powerlines.jsonc",
  "{projectRoot}/powerlines.*.jsonc",
  "{projectRoot}/powerlines.json5",
  "{projectRoot}/powerlines.*.json5",
  "{projectRoot}/powerlines.yaml",
  "{projectRoot}/powerlines.*.yaml",
  "{projectRoot}/powerlines.yml",
  "{projectRoot}/powerlines.*.yml",
  "{projectRoot}/powerlines.toml",
  "{projectRoot}/powerlines.*.toml",
  "{projectRoot}/powerlines.js",
  "{projectRoot}/powerlines.*.js",
  "{projectRoot}/powerlines.cjs",
  "{projectRoot}/powerlines.*.cjs",
  "{projectRoot}/powerlines.mjs",
  "{projectRoot}/powerlines.*.mjs",
  "{projectRoot}/powerlines.ts",
  "{projectRoot}/powerlines.*.ts",
  "{projectRoot}/powerlines.cts",
  "{projectRoot}/powerlines.*.cts",
  "{projectRoot}/powerlines.mts",
  "{projectRoot}/powerlines.*.mts"
] as const;
