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
  ComponentContext,
  createNamedContext,
  useContext
} from "@alloy-js/core";
import type { StoragePreset } from "powerlines/types/fs";

export interface MetaItem {
  /**
   * The kind of metadata item.
   */
  kind?: "builtin" | "entry" | string;

  /**
   * Whether to skip formatting for this output.
   */
  skipFormat?: boolean;

  /**
   * The storage preset or adapter name for the output files.
   *
   * @remarks
   * If not specified, the output mode will be determined by the provided `output.mode` value.
   */
  storage?: StoragePreset | string;

  [key: string]: any;
}

/**
 * The Powerlines meta context used to determine metadata of files generated during rendering.
 */
export const MetaContext: ComponentContext<Record<string, MetaItem>> =
  createNamedContext<Record<string, MetaItem>>("Meta");

/**
 * Hook to access the Powerlines Context.
 *
 * @returns The Context.
 */
export function useMetaContext(): Record<string, MetaItem> | undefined {
  return useContext(MetaContext);
}

/**
 * Hook to safely access the render context's metadata.
 *
 * @returns The Powerlines context or undefined if not set.
 */
export function useMetaSafe(): Record<string, MetaItem> | undefined {
  const meta = useMetaContext();

  return meta ?? undefined;
}

/**
 * Hook to access the render context's metadata.
 *
 * @returns The Powerlines context.
 */
export function useMeta(): Record<string, MetaItem> {
  const meta = useMetaSafe();
  if (!meta) {
    throw new Error(
      "Powerlines metadata is not available in the rendering context. Please make sure the Alloy components are being provided to an invocation of the `render` function added to plugins by `@powerlines/plugin-alloy`."
    );
  }

  return meta;
}
