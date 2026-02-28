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

import { WebpackPluginUserConfig } from "@powerlines/plugin-webpack/types/plugin";
import type { NextConfig } from "next";
import type { WebpackConfigContext } from "next/dist/server/config-shared";
import type { Configuration } from "webpack";
import webpack from "./webpack";

/**
 * A Next.js configuration function that integrates Powerlines into the build process.
 *
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 *
 * @example
 * ```js
 * // next.config.js
 * import withPowerlines from 'powerlines/next'
 *
 * export default withPowerlines({
 *  reactStrictMode: true,
 * })
 * ```
 *
 * @param config - The Next.js configuration to merge with the Powerlines configuration.
 * @returns The merged Next.js configuration.
 */
export function next(config: NextConfig = {}): NextConfig {
  return {
    ...config,
    webpack(webpackConfig: Configuration, context: WebpackConfigContext) {
      const result = (config.webpack?.(webpackConfig, context) ||
        webpackConfig) as Configuration;

      result.plugins ??= [];
      result.plugins.push(webpack(webpackConfig as WebpackPluginUserConfig));

      return result;
    }
  };
}

export default next;
export { next as "module.exports" };
