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

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { existsSync } from "@stryke/fs/exists";
import { createDirectory, removeDirectory } from "@stryke/fs/helpers";
import { joinPaths } from "@stryke/path/join";
import defu from "defu";
import { Plugin } from "powerlines/types/plugin";
import {
  Application,
  PackageJsonReader,
  TSConfigReader,
  TypeDocReader
} from "typedoc";
import {
  TypeDocPluginContext,
  TypeDocPluginOptions,
  TypeDocPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to assist in generating documentation with TypeDoc.
 */
export function plugin(
  options: TypeDocPluginOptions = {}
): Plugin<TypeDocPluginContext> {
  return {
    name: "typedoc",
    async config() {
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines `typedoc` build plugin."
      );

      return {
        docs: {
          typedoc: defu(options, {
            outputPath: joinPaths(
              this.config.projectRoot,
              "docs",
              "generated",
              "api-reference"
            ),
            baseUrl: "/docs/",
            excludeExternals: true,
            excludeInternal: true,
            excludePrivate: true,
            excludeProtected: true,
            hideGenerator: true,
            githubPages: false,
            readme: "none",
            gitRevision: this.workspaceConfig.branch || "main",
            tsconfig: this.tsconfig.tsconfigFilePath,
            plugin: options.plugin ? [] : ["typedoc-plugin-markdown"]
          })
        }
      } as Partial<TypeDocPluginUserConfig>;
    },
    async configResolved() {
      this.typedoc = await Application.bootstrapWithPlugins(
        {
          ...this.config.docs.typedoc,
          exclude:
            this.config.docs.typedoc.exclude ??
            this.tsconfig.tsconfigJson.exclude?.filter(Boolean) ??
            [],
          out: this.config.output.outputPath,
          entryPoints: this.entry.map(entry =>
            joinPaths(this.config.projectRoot, entry.file)
          ),
          ...this.config.docs.typedoc.override
        },
        [new TypeDocReader(), new PackageJsonReader(), new TSConfigReader()]
      );
    },
    async docs() {
      this.log(
        LogLevelLabel.TRACE,
        `Generating documentation for the Powerlines application with TypeDoc.`
      );

      if (existsSync(this.config.docs.typedoc.outputPath)) {
        await removeDirectory(this.config.docs.typedoc.outputPath);
      }

      await createDirectory(this.config.docs.typedoc.outputPath);

      const project = await this.typedoc.convert();
      if (project) {
        await this.typedoc.generateDocs(
          project,
          this.config.docs.typedoc.outputPath
        );
      }
    }
  };
}

export default plugin;
