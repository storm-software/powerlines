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
  Children,
  printTree,
  PrintTreeOptions,
  renderAsync,
  renderTree,
  traverseOutput
} from "@alloy-js/core";
import { noop } from "@stryke/helpers/noop";
import { findFileExtension } from "@stryke/path/file-path-fns";
import { replacePath } from "@stryke/path/replace";
import { list } from "@stryke/string-format/list";
import { PluginContext } from "powerlines";
import { MetaItem, Output } from "./core";
import { OutputFile } from "./types";

/**
 * A function to render children components within the [Alloy](https://alloy-framework.github.io) context, and write any saved content to the file system.
 *
 * @example
 * ```tsx
 * import { render } from "@powerlines/plugin-alloy/render";
 *
 * await render(context, <> ... </>);
 * ```
 *
 * @param context - The Powerlines plugin context.
 * @param children - The children components to render.
 * @returns A promise that resolves when rendering is complete.
 */
export async function render<TContext extends PluginContext>(
  context: TContext,
  children: Children
) {
  const meta = {} as Record<string, MetaItem>;
  const output = await renderAsync(
    <Output context={context} meta={meta}>
      {children}
    </Output>
  );

  const files = [] as OutputFile[];
  await traverseOutput(output, {
    visitDirectory: noop,
    visitFile: file => files.push(file)
  });

  if (!files.length) {
    context.debug("No output files were rendered by the Alloy-js components.");
  } else {
    context.debug(
      `Rendering ${files.length} output files from Alloy-js components: ${list(
        files.map(
          file =>
            `${replacePath(file.path, context.config.cwd)}${
              meta[file.path]?.kind === "builtin" ||
              meta[file.path]?.kind === "infrastructure"
                ? ` (${
                    meta[file.path]?.kind === "builtin"
                      ? "Builtin"
                      : "Infrastructure"
                  })`
                : ""
            }`
        )
      )}.`
    );

    await traverseOutput(output, {
      visitDirectory: directory => {
        if (context.fs.existsSync(directory.path)) {
          return;
        }

        context.fs.mkdirSync(directory.path);
      },
      visitFile: file => {
        if ("contents" in file) {
          const metadata = meta[file.path] ?? {};
          if (metadata.kind === "builtin") {
            if (!metadata.id) {
              throw new Error(
                `Built-in file "${
                  file.path
                }" is missing its ID in the render metadata.`
              );
            }

            context.emitBuiltinSync(file.contents, metadata.id, {
              skipFormat: metadata.skipFormat,
              storage: metadata.storage,
              extension: findFileExtension(file.path)
            });
          } else if (metadata.kind === "entry") {
            context.emitEntrySync(file.contents, file.path, {
              skipFormat: metadata.skipFormat,
              storage: metadata.storage,
              ...(metadata.typeDefinition ?? {})
            });
          } else if (metadata.kind === "infrastructure") {
            if (!metadata.id) {
              throw new Error(
                `Infrastructure file "${
                  file.path
                }" is missing its ID in the render metadata.`
              );
            }

            context.emitInfrastructureSync(file.contents, metadata.id, {
              skipFormat: metadata.skipFormat,
              storage: metadata.storage,
              extension: findFileExtension(file.path)
            });
          } else {
            context.emitSync(file.contents, file.path, metadata);
          }
        } else {
          context.fs.copySync(file.sourcePath, file.path);
        }
      }
    });
  }
}

/**
 * A function to render children components within the [Alloy](https://alloy-framework.github.io) context and return the rendered output as a string.
 *
 * @example
 * ```tsx
 * import { renderString } from "@powerlines/plugin-alloy/render";
 *
 * const output = await renderString(context, <> ... </>);
 * ```
 *
 * @param context - The Powerlines plugin context.
 * @param children - The children components to render.
 * @param options - Optional print tree options.
 * @returns The rendered output as a string.
 */
export function renderString<TContext extends PluginContext>(
  context: TContext,
  children: Children,
  options?: PrintTreeOptions
) {
  const tree = renderTree(<Output context={context}>{children}</Output>);

  return printTree(tree, options);
}
