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

import { toArray } from "@stryke/convert/to-array";
import { listFiles } from "@stryke/fs/list-files";
import { findFileExtensionSafe } from "@stryke/path/find";
import { replacePathTokens } from "powerlines/plugin-utils/paths";
import type { Plugin } from "powerlines/types/plugin";
import { SharpPluginContext, SharpPluginOptions } from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to use Sharp to optimize images used by the project.
 *
 * @see https://sharp.pixelplumbing.com
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends SharpPluginContext = SharpPluginContext
>(
  options: SharpPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "sharp",
    config() {
      return {
        sharp: {
          path: "{projectRoot}/**/*.{jpg,jpeg,png,webp,avif,heif,gif,tiff,jp2,jxl}",
          jpeg: {},
          png: {},
          webp: {},
          avif: {},
          heif: {},
          tiff: {},
          jp2: {},
          jxl: {},
          ...options
        }
      };
    },
    async configResolved() {
      if (!this.config.sharp.path) {
        throw new Error(
          "Sharp plugin requires a path or glob pattern to be specified in the configuration."
        );
      }

      this.config.sharp.path = toArray(this.config.sharp.path).map(path =>
        replacePathTokens(this, path)
      );
    },
    async prepare() {
      await Promise.all(
        toArray(this.config.sharp.path).map(async path => {
          await Promise.all(
            (await listFiles(path)).map(async file => {
              let image = await import("sharp").then(sharpModule =>
                sharpModule.default(file)
              );

              if (this.config.sharp.hook) {
                await this.config.sharp.hook(image);
              }

              const outputPath = this.config.sharp.outputPath
                ? replacePathTokens(this, this.config.sharp.outputPath).replace(
                    /\{fileName\}/g,
                    file.split("/").pop() || "output"
                  )
                : file;

              switch (findFileExtensionSafe(file)?.toLowerCase()) {
                case "jpeg":
                case "jpg":
                  image = image.jpeg(this.config.sharp.jpeg);
                  break;
                case "png":
                  image = image.png(this.config.sharp.png);
                  break;
                case "webp":
                  image = image.webp(this.config.sharp.webp);
                  break;
                case "avif":
                  image = image.avif(this.config.sharp.avif);
                  break;
                case "heif":
                  image = image.heif(this.config.sharp.heif);
                  break;
                case "tiff":
                  image = image.tiff(this.config.sharp.tiff);
                  break;
                case "jp2":
                  image = image.jp2(this.config.sharp.jp2);
                  break;
                case "jxl":
                  image = image.jxl(this.config.sharp.jxl);
                  break;
              }

              await image.toFile(outputPath);
            })
          );
        })
      );
    }
  };
};

export default plugin;
