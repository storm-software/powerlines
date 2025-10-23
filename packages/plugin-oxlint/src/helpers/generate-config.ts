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

import { toArray } from "@stryke/convert/neutral";
import { OxlintPluginOptions } from "../types/plugin";

/**
 * Generates an Oxlint configuration file content based on the provided options.
 *
 * @param options - The options for the Oxlint plugin.
 * @returns The generated configuration as a string.
 */
export function generateConfig(options: OxlintPluginOptions = {}): string {
  return `{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": [
    "import",
    "jsdoc",
    "unicorn",
    "typescript",
    "oxc"
  ],
  "ignorePatterns": [
    "crates/**",
    "dist/**",
    "build/**",
    "coverage/**",
    "node_modules/**",
    "temp/**",
    "tests/fixtures/**"${
      options.ignorePatterns
        ? `,
    ${toArray(options.ignorePatterns)
      .map(pattern => `"${pattern}"`)
      .join(",\n    ")}`
        : ""
    }
  ],
  "rules": {
    "import/named": "error",
    "import/namespace": [
      "error",
      {
        "allowComputed": true
      }
    ],
    "no-unused-expressions": [
      "warn",
      {
        "allowShortCircuit": true,
        "allowTaggedTemplates": true
      }
    ],
    "no-unused-vars": [
      "warn",
      {
        "varsIgnorePattern": "^_",
        "argsIgnorePattern": "^_"
      }
    ],
    "unicorn/prefer-node-protocol": "error"
  }
}`;
}
