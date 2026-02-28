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

import { joinPaths } from "@stryke/path/join-paths";
import { defineGenerator } from "automd";
import { UnresolvedContext } from "powerlines";

/**
 * AutoMD generator to generate environment variable documentation
 *
 * @param context - The generator context.
 * @returns The generated documentation content.
 */
export const env = (context: UnresolvedContext) =>
  defineGenerator({
    name: "env",
    async generate() {
      const envDocFile = joinPaths(
        context.config.root,
        "docs",
        "generated",
        "env.md"
      );

      if (!context.fs.existsSync(envDocFile)) {
        return {
          contents: ""
        };
      }

      const contents = await context.fs.read(envDocFile);

      return {
        contents: contents || ""
      };
    }
  });
