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

import type { NodePath, PluginObj } from "@babel/core";
import type { BabelAPI } from "@babel/helper-plugin-utils";
import { smart } from "@babel/template";
import type { MemberExpression, Statement } from "@babel/types";
import { findFilePath } from "@stryke/path/file-path-fns";
import { fileURLToPath, pathToFileURL } from "mlly";

export const importMetaPathsBabelPlugin = (
  api: BabelAPI,
  options: { filename?: string }
) => {
  return <PluginObj>{
    name: "powerlines:import-meta-paths",
    visitor: {
      Program(path) {
        const metaUrls: Array<NodePath<MemberExpression>> = [];
        const metaDirnames: Array<NodePath<MemberExpression>> = [];
        const metaFilenames: Array<NodePath<MemberExpression>> = [];

        path.traverse({
          MemberExpression(memberExpPath) {
            const { node } = memberExpPath;

            if (
              node.object.type === "MetaProperty" &&
              node.object.meta.name === "import" &&
              node.object.property.name === "meta" &&
              node.property.type === "Identifier"
            ) {
              switch (node.property.name) {
                case "url": {
                  metaUrls.push(memberExpPath);
                  break;
                }
                case "dirname": {
                  metaDirnames.push(memberExpPath);
                  break;
                }
                case "filename": {
                  metaFilenames.push(memberExpPath);
                  break;
                }
              }
            }
          }
        });

        // Update import.meta.url
        for (const meta of metaUrls) {
          meta.replaceWith(
            smart.ast`${
              options.filename
                ? JSON.stringify(pathToFileURL(options.filename))
                : "require('url').pathToFileURL(__filename).toString()"
            }` as Statement
          );
        }

        // Update import.meta.dirname
        for (const metaDirname of metaDirnames) {
          metaDirname.replaceWith(
            smart.ast`${
              options.filename
                ? JSON.stringify(
                    findFilePath(fileURLToPath(pathToFileURL(options.filename)))
                  )
                : "__dirname"
            }` as Statement
          );
        }

        // Update import.meta.filename
        for (const metaFilename of metaFilenames) {
          metaFilename.replaceWith(
            smart.ast`${
              options.filename
                ? JSON.stringify(fileURLToPath(pathToFileURL(options.filename)))
                : "__filename"
            }` as Statement
          );
        }
      }
    }
  };
};
