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
import { readFile } from "@stryke/fs/read-file";
import { writeFile } from "@stryke/fs/write-file";
import { findFileExtensionSafe } from "@stryke/path/find";
import { prettyBytes } from "@stryke/string-format/pretty-bytes";
import chalk from "chalk";
import { Buffer } from "node:buffer";
import { stat } from "node:fs/promises";
import type { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import { optimize } from "svgo";
import {
  ImageCompressionPluginContext,
  ImageCompressionPluginOptions
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  export interface UserConfig {
    imageCompression?: ImageCompressionPluginOptions;
  }
}

/**
 * A Powerlines plugin to optimize image assets used by the project.
 *
 * @see https://sharp.pixelplumbing.com
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends ImageCompressionPluginContext = ImageCompressionPluginContext
>(
  options: ImageCompressionPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "image-compression",
    config() {
      return {
        imageCompression: {
          filter:
            "{root}/**/*.{svg,jpg,jpeg,png,webp,avif,heif,gif,tiff,jp2,jxl}",
          svg: {},
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
      if (!this.config.imageCompression.filter) {
        throw new Error(
          "ImageCompression plugin requires a filter or glob pattern to be specified in the configuration."
        );
      }

      this.config.imageCompression.filter = toArray(
        this.config.imageCompression.filter
      )
        .map(path => replacePathTokens(this, path))
        .filter(Boolean);
    },
    async prepare() {
      await Promise.all(
        toArray(this.config.imageCompression.filter).map(async path => {
          await Promise.all(
            (await listFiles(path)).map(async file => {
              const outputPath = this.config.imageCompression.outputPath
                ? replacePathTokens(
                    this,
                    this.config.imageCompression.outputPath
                  ).replace(/\{fileName\}/g, file.split("/").pop() || "output")
                : file;

              const start = performance.now();
              const originalSize = (await stat(file)).size;
              let compressedSize = 0;

              const extension = findFileExtensionSafe(file).toLowerCase();
              if (!extension) {
                this.error(
                  ` ✘ Failed to optimize ${file} - Unable to determine file extension`
                );
                return;
              }

              if (extension === "svg") {
                const result = optimize(await readFile(file), {
                  multipass: true,
                  path: file,
                  ...this.config.imageCompression.svg
                });
                if (result.data) {
                  compressedSize = Buffer.byteLength(result.data, "utf8");
                  await writeFile(outputPath, result.data);
                }
              } else {
                let image = await import("sharp").then(sharpModule =>
                  sharpModule.default(file, { animated: extension === "gif" })
                );

                switch (extension) {
                  case "jpeg":
                  case "jpg":
                    image = image.jpeg(this.config.imageCompression.jpeg);
                    break;
                  case "png":
                    image = image.png(this.config.imageCompression.png);
                    break;
                  case "webp":
                    image = image.webp(this.config.imageCompression.webp);
                    break;
                  case "avif":
                    image = image.avif(this.config.imageCompression.avif);
                    break;
                  case "gif":
                    image = image.gif(this.config.imageCompression.gif);
                    break;
                  case "heif":
                    image = image.heif(this.config.imageCompression.heif);
                    break;
                  case "tiff":
                    image = image.tiff(this.config.imageCompression.tiff);
                    break;
                  case "jp2":
                    image = image.jp2(this.config.imageCompression.jp2);
                    break;
                  case "jxl":
                    image = image.jxl(this.config.imageCompression.jxl);
                    break;
                }

                const result = await image.toFile(outputPath);
                compressedSize = result.size;
              }

              if (!compressedSize) {
                this.error(` ✘ Failed to optimize ${file} - No data returned`);
                return;
              }

              if (compressedSize >= originalSize) {
                this.error(
                  ` ✘ Failed to optimize ${file} - Compression output was not smaller than the original`
                );
                return;
              }

              this.info(
                ` ✔ Successfully optimized ${
                  file
                }: ${chalk.redBright(prettyBytes(originalSize))} -> ${chalk.greenBright(
                  prettyBytes(compressedSize)
                )} (${chalk.green(
                  (100 - (compressedSize / originalSize) * 100).toFixed(2)
                )}%) in ${(performance.now() - start).toFixed(2)} ms`
              );
            })
          );
        })
      );
    }
  };
};

export default plugin;
