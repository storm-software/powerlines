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
  DataFileCollection,
  JavaScriptFileConfiguration,
  serialize,
  TypeDefinitionFileConfiguration,
  Writer
} from "@content-collections/core";
import { joinPaths } from "@stryke/path/join-paths";
import { kebabCase } from "@stryke/string-format/kebab-case";
import pluralize from "pluralize";
import { getBaseFileHeader } from "powerlines/lib/utilities/file-header";
import { ContentCollectionsPluginContext } from "../types/plugin";

const createConstName = (name: string) => {
  return pluralize(name.charAt(0).toUpperCase() + name.slice(1));
};

const createArrayConstName = (name: string) => {
  return `all${createConstName(name)}`;
};

/**
 *
 * @param context - The Powerlines build plugin
 * @returns
 */
export const createWriter = (
  context: ContentCollectionsPluginContext
): Writer => {
  return {
    createJavaScriptFile: async (
      configuration: JavaScriptFileConfiguration
    ) => {
      return context.emitBuiltin(
        `${getBaseFileHeader(context)}
${configuration.collections
  .map(
    ({ name }) =>
      `import ${createArrayConstName(name)} from "./${kebabCase(name)}";`
  )
  .join("\n")}

export { ${configuration.collections
          .map(({ name }) => createArrayConstName(name))
          .join(", ")} };
`,
        "content"
      );
    },
    createTypeDefinitionFile: async (_: TypeDefinitionFileConfiguration) =>
      Promise.resolve(),
    createDataFiles: async (collections: Array<DataFileCollection>) => {
      await Promise.all(
        collections.map(async collection => {
          if (context.config.contentCollections.outputPath) {
            return context.fs.writeFile(
              joinPaths(
                context.config.contentCollections.outputPath,
                kebabCase(collection.name)
              ),
              serialize(collection.documents.map(doc => doc.document))
            );
          }

          return context.emitBuiltin(
            serialize(collection.documents.map(doc => doc.document)),
            joinPaths("content", kebabCase(collection.name))
          );
        })
      );
    }
  };
};
