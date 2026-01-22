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

import { capnpc } from "@stryke/capnp/compile";
import { resolveOptions } from "@stryke/capnp/helpers";
import { findFileName } from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import defu from "defu";
import { replacePathTokens } from "powerlines/plugin-utils/paths";
import { Plugin } from "powerlines/types/plugin";
import {
  CapnpPluginContext,
  CapnpPluginOptions,
  CapnpPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate Cap'n Proto for code generation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends CapnpPluginContext = CapnpPluginContext
>(
  options: CapnpPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "capnp",
    config() {
      return {
        capnp: defu(options, {
          ts: true,
          js: false,
          dts: false,
          tty: true,
          tsconfig: this.tsconfig,
          schema: joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "*.capnp"
          ),
          outputPath: joinPaths("{builtinPath}", "capnp")
        })
      } as Partial<CapnpPluginUserConfig>;
    },
    configResolved() {
      this.config.capnp.outputPath = replacePathTokens(
        this,
        this.config.capnp.outputPath
      );
    },
    async prepare() {
      const resolvedOptions = await resolveOptions({
        ...this.config.capnp,
        schemas: this.config.capnp.schema.toString(),
        projectRoot: this.config.projectRoot,
        workspaceRoot: this.workspaceConfig.workspaceRoot
      });
      if (!resolvedOptions?.schemas?.length) {
        this.warn("No Cap'n Proto schemas found to compile.");

        return;
      }

      const result = await capnpc(resolvedOptions);

      if (isParentPath(this.config.capnp.outputPath, this.builtinsPath)) {
        await Promise.all(
          Object.entries(result.files).map(async ([filePath, content]) =>
            this.emitBuiltin(
              content,
              findFileName(
                joinPaths(
                  replacePath(this.config.capnp.outputPath, this.builtinsPath),
                  filePath
                ),
                { withExtension: false }
              )
            )
          )
        );
      } else {
        await Promise.all(
          Object.entries(result.files).map(async ([filePath, content]) =>
            this.fs.write(
              joinPaths(this.config.capnp.outputPath, filePath),
              content
            )
          )
        );
      }
    }
  };
};

export default plugin;
