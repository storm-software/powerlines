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
 * import withPowerlines from '@powerlines/unplugin/next'
 *
 * export default withPowerlines({
 *  reactStrictMode: true,
 * })
 * ```
 *
 * @param options - The Next.js configuration to merge with the Powerlines configuration.
 * @returns The merged Next.js configuration.
 */
export function withPlugin(options: NextConfig): NextConfig {
  return {
    ...options,
    webpack(config: Configuration, context: WebpackConfigContext) {
      const result = (options.webpack?.(config, context) ||
        config) as Configuration;

      result.plugins ??= [];
      result.plugins.push(webpack());

      return result;
    }
  };
}

export default withPlugin;
