/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { Children, PrintTreeOptions } from "@alloy-js/core";
import { Output, printTree, renderTree } from "@alloy-js/core";
import { generate } from "@power-plant/alloy-js/generate";
import type { GeneratedDocument, MetaConfig } from "@power-plant/core";
import { findFileExtension } from "@stryke/path/file-path-fns";
import { replacePath } from "@stryke/path/replace";
import { list } from "@stryke/string-format/list";
import type { PluginContext, StoragePreset } from "powerlines";
import { PowerlinesContext } from "./core/contexts/context";

export interface MetaItem extends MetaConfig {
  /**
   * The kind of metadata item.
   */
  kind?: "builtin" | "entry" | "infrastructure" | string;

  /**
   * Whether to skip formatting for this output.
   */
  skipFormat?: boolean;

  /**
   * The storage preset or adapter name for the output files.
   */
  storage?: StoragePreset | string;

  /**
   * Built-in / infrastructure module id.
   */
  id?: string;

  /**
   * Entry type definition metadata.
   */
  typeDefinition?: Record<string, unknown>;

  [key: string]: any;
}

function getDocumentMeta(document: GeneratedDocument): MetaItem {
  return document.meta ?? document.chunks?.[0]?.meta ?? {};
}

function getDocumentContents(document: GeneratedDocument): string {
  return (document.chunks ?? []).map(chunk => chunk.content ?? "").join("");
}

/**
 * A function to render children components within the [Alloy](https://alloy-framework.github.io) context, and write any saved content to the file system.
 *
 * @remarks
 * Uses Power Plant's {@link generate | `generate`} entry point to create an
 * execution context and render Alloy-js templates, then emits the resulting
 * documents through the Powerlines plugin context.
 *
 * @example
 * ```tsx
 * import { render } from "@powerlines/plugin-alloy/render";
 *
 * await render(context, <> ... </>);
 * ```
 *
 * @see https://github.com/storm-software/power-plant/blob/main/packages/generators/alloy-js/src/generate.ts
 *
 * @param context - The Powerlines plugin context.
 * @param children - The children components to render.
 * @returns A promise that resolves when rendering is complete.
 */
export async function render<TContext extends PluginContext>(
  context: TContext,
  children: Children
) {
  // Power Plant generate types may not resolve cleanly across package boundaries.
  // eslint-disable-next-line ts/no-unsafe-call -- generate entry typing
  const documents = (await generate(
    // Alloy Children types can diverge across transitive @alloy-js/core versions.
    (
      <PowerlinesContext.Provider value={context}>
        {children}
      </PowerlinesContext.Provider>
    ) as never,
    {},
    {
      cwd: context.config.cwd,
      logger: {
        debug: message => context.debug(message),
        info: message => context.info(message),
        warn: message => context.warn(message),
        error: message => context.error(message)
      },
      settings: {
        skipStorage: true
      }
    }
  )) as Record<string, GeneratedDocument>;

  const entries = Object.values(documents);

  if (!entries.length) {
    context.debug("No output files were rendered by the Alloy-js components.");
    return;
  }

  context.debug(
    `Emitting ${entries.length} output files from Alloy-js components: ${list(
      entries.map(document => {
        const metadata = getDocumentMeta(document);

        return `${replacePath(document.path, context.config.cwd)}${
          metadata.kind === "builtin" || metadata.kind === "infrastructure"
            ? ` (${metadata.kind === "builtin" ? "Builtin" : "Infrastructure"})`
            : ""
        }`;
      })
    )}.`
  );

  for (const document of entries) {
    const metadata = getDocumentMeta(document);
    const contents = getDocumentContents(document);

    if (metadata.kind === "builtin") {
      if (!metadata.id) {
        throw new Error(
          `Built-in file "${document.path}" is missing its ID in the render metadata.`
        );
      }

      context.emitBuiltinSync(contents, metadata.id, {
        skipFormat: metadata.skipFormat,
        storage: metadata.storage,
        extension: findFileExtension(document.path)
      });
    } else if (metadata.kind === "entry") {
      context.emitEntrySync(contents, document.path, {
        skipFormat: metadata.skipFormat,
        storage: metadata.storage,
        ...(metadata.typeDefinition ?? {})
      });
    } else if (metadata.kind === "infrastructure") {
      if (!metadata.id) {
        throw new Error(
          `Infrastructure file "${document.path}" is missing its ID in the render metadata.`
        );
      }

      context.emitInfrastructureSync(contents, metadata.id, {
        skipFormat: metadata.skipFormat,
        storage: metadata.storage,
        extension: findFileExtension(document.path)
      });
    } else {
      context.emitSync(contents, document.path, metadata);
    }
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
    <PowerlinesContext.Provider value={context}>
      <Output basePath={context.config.cwd}>{children}</Output>
    </PowerlinesContext.Provider>
  );

  return printTree(tree, options);
}
