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

import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";
import {
  AvifOptions,
  GifOptions,
  HeifOptions,
  Jp2Options,
  JpegOptions,
  JxlOptions,
  PngOptions,
  Sharp,
  TiffOptions,
  WebpOptions
} from "sharp";

export interface SharpPluginOptions {
  /**
   * A path or glob pattern (or an array of paths and glob patterns) to image files to optimize during Powerlines processing.
   *
   * @defaultValue "\{projectRoot\}/**\/*.\{jpg,jpeg,png,webp,avif,heif,gif,tiff,jp2,jxl\}"
   */
  path?: string | string[];

  /**
   * The path for the Sharp optimized image files
   *
   * @remarks
   * By default, it will generate the output files alongside each image file.
   */
  outputPath?: string;

  /**
   * A function to perform additional processing on the Sharp instance before saving the output image.
   *
   * @param sharp - The Sharp instance for the current image.
   * @returns A promise that resolves when processing is complete.
   */
  hook?: (sharp: Sharp) => Promise<any>;

  /**
   * These JPEG options used for output image
   */
  jpeg?: JpegOptions;

  /**
   * These JP2 (JPEG 2000) options used for output image
   */
  jp2?: Jp2Options;

  /**
   * These JPEG-XL (JXL) options used for output image
   */
  jxl?: JxlOptions;

  /**
   * These PNG options used for output image
   */
  png?: PngOptions;

  /**
   * These WebP options used for output image
   */
  webp?: WebpOptions;

  /**
   * These GIF options used for output image
   */
  gif?: GifOptions;

  /**
   * These AVIF options used for output image
   */
  avif?: AvifOptions;

  /**
   * These HEIF options used for output image
   */
  heif?: HeifOptions;

  /**
   * These TIFF options used for output image
   */
  tiff?: TiffOptions;
}

export interface SharpPluginUserConfig extends UserConfig {
  sharp?: SharpPluginOptions;
}

export interface SharpPluginResolvedConfig extends ResolvedConfig {
  sharp: Omit<
    SharpPluginOptions,
    | "path"
    | "jpeg"
    | "png"
    | "webp"
    | "avif"
    | "heif"
    | "tiff"
    | "jp2"
    | "jxl"
    | "gif"
  > &
    Required<
      Pick<
        SharpPluginOptions,
        | "path"
        | "jpeg"
        | "png"
        | "webp"
        | "avif"
        | "heif"
        | "tiff"
        | "jp2"
        | "jxl"
        | "gif"
      >
    >;
}

export type SharpPluginContext<
  TResolvedConfig extends SharpPluginResolvedConfig = SharpPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
