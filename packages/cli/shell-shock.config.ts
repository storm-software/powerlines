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

import type { UserConfig } from "@shell-shock/core";
import { defineConfig } from "@shell-shock/core";
import cli from "@shell-shock/preset-cli";

const config: UserConfig = defineConfig({
  skipCache: true,
  title: "Powerlines",
  plugins: [
    cli({
      theme: {
        labels: {
          banner: {
            header: "Powerlines CLI",
            footer: "https://stormsoftware.com"
          }
        }
      }
    })
  ]
});

export default config;
