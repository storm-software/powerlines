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

import { listFiles } from "@stryke/fs/list-files";
import { appendPath } from "@stryke/path/append";
import { findFileName } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join";
import { isSet } from "@stryke/type-checks/is-set";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isString } from "@stryke/type-checks/is-string";
import defu from "defu";
import { I18nextToolkitConfig, runExtractor } from "i18next-cli";
import { mergeResourcesAsInterface } from "i18next-resources-for-ts";
import { Plugin } from "powerlines/types/plugin";
import { getOutputPath } from "./helpers/config-utils";
import { Resource, ResourceContent } from "./types/i18n";
import {
  I18NextPluginContext,
  I18NextPluginOptions,
  I18NextPluginResolvedConfig
} from "./types/plugin";

export * from "./types";

/**
 * i18next Plugin
 *
 * @remarks
 * A Powerlines plugin to use the i18next internationalization framework during the prepare task.
 *
 * @see https://i18next.com
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends I18NextPluginContext = I18NextPluginContext
>(
  options: I18NextPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "i18next",
    async config() {
      const i18next = defu<
        I18NextPluginResolvedConfig["i18next"],
        I18NextPluginOptions[]
      >(
        options,
        {
          extract: {
            output: (language: string, namespace = "translation") =>
              joinPaths(
                this.config.projectRoot,
                `locales/${language}/${namespace}.json`
              ),
            primaryLanguage: this.workspaceConfig.locale
          }
        },
        {
          extract: {
            input: [
              "src/**/*.ts",
              "src/**/*.tsx",
              "src/**/*.js",
              "src/**/*.jsx"
            ],
            indentation: 2,
            defaultNS: "translation",
            mergeNamespaces: true,
            nsSeparator: ":",
            keySeparator: ".",
            primaryLanguage:
              options.locales && options.locales.length > 0
                ? options.locales[0]
                : "en"
          },
          types: {
            enableSelector: false
          },
          locales: [] as string[]
        }
      );

      if (!i18next.locales || i18next.locales.length === 0) {
        i18next.locales = [i18next.extract.primaryLanguage || "en"];
      }

      if (!isSet(i18next.types.indentation)) {
        i18next.types.indentation = i18next.extract.indentation;
      }

      return {
        i18next
      };
    },
    async configResolved() {},
    async prepare() {
      await runExtractor(
        this.config.i18next as I18nextToolkitConfig,
        {
          isWatchMode: false,
          isDryRun: false,
          syncAll: true,
          syncPrimaryWithDefaults: true
        },
        {
          info: (message: string) => {
            this.info(message);
          },
          warn: (message: string, _more?: any) => {
            this.warn(message);
          },
          error: (message: string | any) => {
            this.error(message);
          }
        }
      );
    },
    async types(code: string) {
      const resources: Resource[] = [];
      for (const file of await listFiles(
        getOutputPath(
          this.config.i18next.extract.output,
          this.config.i18next.extract.primaryLanguage,
          "*"
        )
      )) {
        const namespace = findFileName(file, { withExtension: false });
        const parsedContent = await this.resolver.import<ResourceContent>(file);

        // If mergeNamespaces is used, a single file can contain multiple namespaces
        // (e.g. { "translation": { ... }, "common": { ... } } in a per-language file).
        // In that case, expose each top-level key as a namespace entry so the type
        // generator will produce top-level namespace interfaces (not a language wrapper).
        if (
          this.config.i18next.extract.mergeNamespaces &&
          isSetObject(parsedContent)
        ) {
          // If we have at least one object and we are in mergeNamespaces mode, assume it's a merged file
          if (
            Object.keys(parsedContent).filter(k =>
              isSetObject(parsedContent[k])
            ).length > 0
          ) {
            for (const nsName of Object.keys(parsedContent).filter(k =>
              isSetObject(parsedContent[k])
            )) {
              resources.push({
                name: nsName,
                resources: parsedContent[nsName] as ResourceContent
              });
            }

            if (
              Object.keys(parsedContent).filter(
                k => !isSetObject(parsedContent[k])
              ).length > 0
            ) {
              this.warn(
                `The file ${file} contains top-level keys that are not objects (${Object.keys(
                  parsedContent
                )
                  .filter(k => !isSetObject(parsedContent[k]))
                  .join(
                    ", "
                  )}). When 'mergeNamespaces' is enabled, top-level keys are treated as namespaces. These keys will be ignored.`
              );
            }

            continue;
          }
        }

        resources.push({ name: namespace, resources: parsedContent });
      }

      let result!: string;
      if (this.config.i18next.types.resourcesFile) {
        await this.fs.write(
          appendPath(
            this.config.i18next.types.resourcesFile,
            this.config.i18next.types.output || this.config.projectRoot
          ),
          mergeResourcesAsInterface(resources, {
            optimize: !!this.config.i18next.types.enableSelector,
            indentation: this.config.i18next.types.indentation
          })
        );
      } else {
        result = `${code}

${mergeResourcesAsInterface(resources, {
  optimize: !!this.config.i18next.types.enableSelector,
  indentation: this.config.i18next.types.indentation
})}

/**
 * i18next Custom Type Options
 *
 * @see https://www.i18next.com/overview/typescript#custom-type-options
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    enableSelector: ${isString(this.config.i18next.types.enableSelector) ? `"${this.config.i18next.types.enableSelector}"` : this.config.i18next.types.enableSelector};
    defaultNS: ${
      this.config.i18next.extract.defaultNS === false
        ? "false"
        : `'${this.config.i18next.extract.defaultNS || "translation"}'`
    };
    resources: Resources;
  }
}
`;
      }

      return result;
    }
  };
};

export default plugin;
