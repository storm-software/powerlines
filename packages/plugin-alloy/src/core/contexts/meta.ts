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

import { UNSAFE_AlloyPluginContext } from "@powerlines/plugin-alloy/types/_internal";
import type { StoragePreset } from "powerlines/types/fs";
import { usePowerlines } from "./context";

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
 * Hook to safely access the render context's metadata.
 *
 * @returns The Powerlines context or undefined if not set.
 */
export function useMetaSafe(): Record<string, MetaItem> | undefined {
  const context = usePowerlines();

  return (
    (context as unknown as UNSAFE_AlloyPluginContext).$$internal.meta.alloy ??
    undefined
  );
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
