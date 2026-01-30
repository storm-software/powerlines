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
import { Output } from "@powerlines/plugin-alloy/core/components/output";
import { findFileExtension } from "@stryke/path/file-path-fns";
import { PluginContext } from "powerlines/types/context";
import { MetaItem } from "./core";

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
    <Output<TContext> context={context} meta={meta}>
      {children}
    </Output>
  );

  if (!Object.keys(output).length) {
    context.debug(
      "No output files were rendered by Alloy-js component templates."
    );
  } else {
    context.debug(
      `Processing ${
        Object.keys(output).length
      } rendered output files from Alloy-js component templates.`
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
  const tree = renderTree(
    <Output<TContext> context={context}>{children}</Output>
  );

  return printTree(tree, options);
}
