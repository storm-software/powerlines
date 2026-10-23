/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import { defineConfig } from "@sourcebook/config";

export default defineConfig({
  homepage: "https://stormsoftware.com/projects/powerlines",
  useLocalOutput: false,
  displayName: "Powerlines",
  docs: [
    {
      type: "application",
      variant: "cli",
      outputPath: "docs/cli",
      src: "packages/devkit/cli"
    },
    {
      type: "library",
      outputPath: "docs/packages",
      packages: ["packages/base", "packages/devkit", "packages/plugins"]
    }
  ]
});
