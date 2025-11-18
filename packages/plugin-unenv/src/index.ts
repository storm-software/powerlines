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

import { Plugin } from "powerlines/types/plugin";
import { defineEnv } from "unenv";
import { UnenvPluginContext, UnenvPluginOptions } from "./types/plugin";

export * from "./types";

/**
 * The unenv plugin for Powerlines.
 *
 * @see https://unjs.dev/packages/unenv
 *
 * @param options - The unenv plugin user configuration options.
 * @returns A Powerlines plugin to transform source code to be platform agnostic using unenv.
 */
export const plugin = <
  TContext extends UnenvPluginContext = UnenvPluginContext
>(
  options: UnenvPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "unenv",
    async config() {
      return {
        unenv: options
      };
    },
    configResolved() {
      this.unenv = defineEnv(this.config.unenv || {});

      this.config.build.alias ??= {};
      if (Array.isArray(this.config.build.alias)) {
        this.config.build.alias = Object.entries(this.unenv.env.alias).reduce(
          (aliases, [key, value]) => {
            if (!aliases.find(alias => alias.find === key)) {
              aliases.push({ find: key, replacement: value });
            }

            return aliases;
          },
          this.config.build.alias
        );
      } else {
        this.config.build.alias = {
          ...this.unenv.env.alias,
          ...this.config.build.alias
        };
      }

      this.config.build.external ??= [];
      this.config.build.external.push(...this.unenv.env.external);

      this.config.build.inject ??= {};
      this.config.build.inject = {
        ...(this.unenv.env.inject as Record<string, string | string[]>),
        ...this.config.build.inject
      };

      this.config.build.polyfill ??= [];
      this.config.build.polyfill.push(...this.unenv.env.polyfill);
    }
  } as Plugin<TContext>;
};

export default plugin;
