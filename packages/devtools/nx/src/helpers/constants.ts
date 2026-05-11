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
  "{projectRoot}/{framework}.json",
  "{projectRoot}/{framework}.*.json",
  "{projectRoot}/{framework}.jsonc",
  "{projectRoot}/{framework}.*.jsonc",
  "{projectRoot}/{framework}.json5",
  "{projectRoot}/{framework}.*.json5",
  "{projectRoot}/{framework}.yaml",
  "{projectRoot}/{framework}.*.yaml",
  "{projectRoot}/{framework}.yml",
  "{projectRoot}/{framework}.*.yml",
  "{projectRoot}/{framework}.toml",
  "{projectRoot}/{framework}.*.toml",
  "{projectRoot}/{framework}.config.js",
  "{projectRoot}/{framework}.*.config.js",
  "{projectRoot}/{framework}.config.cjs",
  "{projectRoot}/{framework}.*.config.cjs",
  "{projectRoot}/{framework}.config.mjs",
  "{projectRoot}/{framework}.*.config.mjs",
  "{projectRoot}/{framework}.config.ts",
  "{projectRoot}/{framework}.*.config.ts",
  "{projectRoot}/{framework}.config.cts",
  "{projectRoot}/{framework}.*.config.cts",
  "{projectRoot}/{framework}.config.mts",
  "{projectRoot}/{framework}.*.config.mts"
] as const;
