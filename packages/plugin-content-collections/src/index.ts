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

import {
  build,
  createBuildContext,
  createConfigurationReader,
  InternalConfiguration
} from "@content-collections/core";
import { existsSync } from "@stryke/fs/exists";
import { joinPaths } from "@stryke/path/join";
import defu from "defu";
import { createHash } from "node:crypto";
import { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import { createEmitter } from "./helpers/create-emitter";
import { createWriter } from "./helpers/create-writer";
import {
  ContentCollectionsPluginContext,
  ContentCollectionsPluginOptions,
  ContentCollectionsPluginUserConfig
} from "./types/plugin";

export * from "./helpers";
export * from "./types";

declare module "powerlines" {
  export interface UserConfig {
    contentCollections?: ContentCollectionsPluginOptions;
  }
}

/**
 * A Powerlines plugin to integrate Content Collections for code generation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends ContentCollectionsPluginContext =
    ContentCollectionsPluginContext
>(
  options: ContentCollectionsPluginOptions
): Plugin<TContext> => {
  return {
    name: "content-collections",
    config() {
      return {
        contentCollections: defu(options, {
          configFile: "{root}/content-collections.ts",
          collections: []
        })
      } as Partial<ContentCollectionsPluginUserConfig>;
    },
    async configResolved() {
      this.config.contentCollections.configFile ||= replacePathTokens(
        this,
        this.config.contentCollections.configFile
      );

      this.config.contentCollections.outputPath ||= replacePathTokens(
        this,
        this.config.contentCollections.outputPath
      );

      const emitter = createEmitter();
      const readConfiguration = createConfigurationReader();

      let configuration = {} as InternalConfiguration;
      try {
        if (existsSync(this.config.contentCollections.configFile)) {
          configuration = await readConfiguration(
            this.config.contentCollections.configFile,
            {
              configName: "config.mjs",
              cacheDir: joinPaths(this.cachePath, "content-collections")
            }
          );
        }
      } catch {
        // Do nothing
      }

      configuration = defu(configuration ?? {}, this.config.contentCollections);
      configuration.checksum = createHash("sha256")
        .update(JSON.stringify(configuration))
        .digest("hex");

      const context = await createBuildContext({
        emitter,
        baseDirectory: joinPaths(
          this.workspaceConfig.workspaceRoot,
          this.config.root
        ),
        outputDirectory:
          this.config.contentCollections.outputPath ||
          joinPaths(this.builtinsPath, "content"),
        configuration
      });
      context.writer = createWriter(this);

      this.contentCollections = {
        context,
        build: async () => build(context),
        on: emitter.on
      };
    },
    async prepare() {
      return this.contentCollections.build();
    }
  };
};

export default plugin;
