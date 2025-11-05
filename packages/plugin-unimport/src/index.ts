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
import { throttle } from "@stryke/helpers/throttle";
import { StormJSON } from "@stryke/json/storm-json";
import { joinPaths } from "@stryke/path/join";
import defu from "defu";
import MagicString from "magic-string";
import { Plugin } from "powerlines/types/plugin";
import {
  createUnimport,
  ImportInjectionResult,
  InjectImportsOptions
} from "unimport";
import {
  UnimportContext,
  UnimportPluginContext,
  UnimportPluginOptions,
  UnimportPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate Unimport for code generation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends UnimportPluginContext = UnimportPluginContext
>(
  options: UnimportPluginOptions
): Plugin<TContext> => {
  return {
    name: "unimport",
    config() {
      return {
        unimport: defu(options, {
          commentsDisable: [
            "@unimport-disable",
            "@unimport-ignore",
            "@imports-disable",
            "@imports-ignore",
            "@powerlines-disable",
            "@powerlines-ignore"
          ],
          commentsDebug: [
            "@unimport-debug",
            "@imports-debug",
            "@powerlines-debug"
          ],
          injectAtEnd: true
        })
      } as Partial<UnimportPluginUserConfig>;
    },
    async configResolved() {
      const { injectImports, init, ...rest } = createUnimport(
        this.config.unimport
      );
      this.unimport = { ...rest } as UnimportContext;

      this.unimport.dumpImports = throttle(async () => {
        this.log(LogLevelLabel.TRACE, "Dumping import file...");

        const items = await this.unimport.getImports();

        this.log(
          LogLevelLabel.TRACE,
          `Writing imports-dump JSON file: ${joinPaths(this.dataPath, "imports-dump.json")}`
        );

        const content = StormJSON.stringify(items);
        if (content.trim() !== this.unimport.lastImportsDump?.trim()) {
          this.unimport.lastImportsDump = content;
          await this.fs.writeFile(
            joinPaths(this.dataPath, "imports-dump.json"),
            content,
            { mode: "fs" }
          );
        }
      }, 1000);

      this.unimport.injectImports = async (
        code: string | MagicString,
        id?: string,
        options?: InjectImportsOptions
      ): Promise<ImportInjectionResult> => {
        const result = await injectImports(code, id, options);

        if (!result.s.hasChanged()) {
          return result;
        }

        await this.unimport.dumpImports();

        return result;
      };

      this.unimport.init = async () => {
        await init();
        await this.unimport.dumpImports();
      };

      await this.unimport.init();
    },
    async transform(code, id) {
      const result = await this.unimport.injectImports(code, id);
      if (!result.s.hasChanged()) {
        return null;
      }

      return {
        id,
        code: result.s.toString(),
        map: result.s.generateMap({
          source: id,
          includeContent: true,
          hires: true
        })
      };
    }
  };
};

export default plugin;
