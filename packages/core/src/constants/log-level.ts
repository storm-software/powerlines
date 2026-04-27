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

export const DEFAULT_DEVELOPMENT_LOG_LEVEL = {
  general: "debug",
  fs: "info",
  config: "info",
  plugins: "debug",
  hooks: "debug",
  performance: "debug",
  env: "debug",
  ipc: "debug",
  network: "debug",
  babel: "debug"
} as const;

export const DEFAULT_TEST_LOG_LEVEL = {
  general: "info",
  fs: "warn",
  config: "warn",
  plugins: "warn",
  hooks: "warn",
  performance: "info",
  env: "warn",
  ipc: "warn",
  network: "warn",
  babel: "warn"
} as const;

export const DEFAULT_PRODUCTION_LOG_LEVEL = {
  general: "info",
  fs: "error",
  config: "warn",
  plugins: "warn",
  hooks: "warn",
  performance: "info",
  env: "error",
  ipc: "error",
  network: "error",
  babel: "warn"
} as const;
