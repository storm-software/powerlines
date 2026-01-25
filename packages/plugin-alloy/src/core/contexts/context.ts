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

import type { PluginContext } from "powerlines/types/context";
import type { StoragePreset } from "powerlines/types/fs";
import { unctx } from "../../internal/unctx";

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

export interface PowerlinesContextInterface<
  TContext extends PluginContext = PluginContext,
  TMeta extends Record<string, MetaItem> = Record<string, MetaItem>
> {
  /**
   * The current Powerlines context.
   */
  value: TContext;

  /**
   * The current render metadata.
   */
  meta: TMeta;
}

/**
 * Hook to access the Powerlines Context.
 *
 * @returns The Context.
 */
export function usePowerlinesContext<
  TContext extends PluginContext = PluginContext,
  TMeta extends Record<string, MetaItem> = Record<string, MetaItem>
>(): PowerlinesContextInterface<TContext, TMeta> | null {
  return unctx.tryUse();
}

/**
 * Hook to safely access the {@link PluginContext | Powerlines context}.
 *
 * @returns The Powerlines context or null if not set.
 */
export function usePowerlinesSafe<
  TContext extends PluginContext = PluginContext
>(): TContext | null {
  const powerlines = usePowerlinesContext<TContext>();

  return powerlines?.value ?? null;
}

/**
 * Hook to access the {@link PluginContext | Powerlines context}.
 *
 * @returns The Powerlines context.
 */
export function usePowerlines<
  TContext extends PluginContext = PluginContext
>(): TContext {
  const powerlines = usePowerlinesSafe<TContext>();
  if (!powerlines) {
    throw new Error(
      "Powerlines - Context is not set. Please make sure the Alloy components are being provided to an invocation of the `render` function added to plugins by `@powerlines/plugin-alloy`."
    );
  }

  return powerlines;
}

/**
 * Hook to safely access the render context's metadata.
 *
 * @returns The Powerlines context or null if not set.
 */
export function useMetaSafe<
  TMeta extends Record<string, MetaItem> = Record<string, MetaItem>
>(): TMeta | null {
  const powerlines = usePowerlinesContext<PluginContext, TMeta>();

  return powerlines?.meta ?? null;
}

/**
 * Hook to access the render context's metadata.
 *
 * @returns The Powerlines context.
 */
export function useMeta<
  TMeta extends Record<string, MetaItem> = Record<string, MetaItem>
>(): TMeta {
  const meta = useMetaSafe<TMeta>();
  if (!meta) {
    throw new Error(
      "Powerlines metadata is not available in the rendering context. Please make sure the Alloy components are being provided to an invocation of the `render` function added to plugins by `@powerlines/plugin-alloy`."
    );
  }

  return meta;
}
