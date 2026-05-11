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

import { PluginContext, ResolvedConfig, UserConfig } from "powerlines";
import {
  AvifOptions,
  GifOptions,
  HeifOptions,
  Jp2Options,
  JpegOptions,
  JxlOptions,
  PngOptions,
  TiffOptions,
  WebpOptions
} from "sharp";
import { Config as SvgOptions } from "svgo";

export interface ImageCompressionPluginOptions {
  /**
   * A path or glob pattern (or an array of paths and glob patterns) to image files to optimize during Powerlines processing.
   *
   * @defaultValue "\{root\}/**\/*.\{svg,jpg,jpeg,png,webp,avif,heif,gif,tiff,jp2,jxl\}"
   */
  filter?: string | string[];

  /**
   * The output directory for the optimized images.
   *
   * @remarks
   * By default, it will generate the output files alongside each input image file.
   */
  outputPath?: string;

  /**
   * These SVGO options used for SVG optimization
   */
  svg?: SvgOptions;

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

export interface ImageCompressionPluginUserConfig extends UserConfig {
  imageCompression?: ImageCompressionPluginOptions;
}

export interface ImageCompressionPluginResolvedConfig extends ResolvedConfig {
  imageCompression: Omit<
    ImageCompressionPluginOptions,
    | "filter"
    | "svg"
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
        ImageCompressionPluginOptions,
        | "filter"
        | "svg"
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

export type ImageCompressionPluginContext<
  TResolvedConfig extends ImageCompressionPluginResolvedConfig =
    ImageCompressionPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
