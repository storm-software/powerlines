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

import type { OutputProps as OutputPropsExternal } from "@alloy-js/core";
import { computed, Output as OutputExternal, splitProps } from "@alloy-js/core";
import type { PluginContext } from "@powerlines/core/types";
import { MetaContext, MetaItem } from "../contexts";
import { PowerlinesContext } from "../contexts/context";

export interface OutputProps<
  TContext extends PluginContext = PluginContext
> extends Omit<OutputPropsExternal, "basePath"> {
  /**
   * The current Powerlines process context.
   */
  context: TContext;

  /**
   * The file metadata collected during rendering.
   */
  meta?: Record<string, MetaItem>;
}

/**
 * Output component for rendering the Powerlines plugin's output files via templates.
 */
export function Output<TContext extends PluginContext = PluginContext>(
  props: OutputProps<TContext>
) {
  const [{ children, context, meta = {} }, rest] = splitProps(props, [
    "children",
    "context",
    "meta"
  ]);

  const contextRef = computed(() => context);

  return (
    <MetaContext.Provider value={meta}>
      <PowerlinesContext.Provider value={contextRef.value}>
        <OutputExternal
          {...rest}
          basePath={contextRef.value.workspaceConfig.workspaceRoot}>
          {children}
        </OutputExternal>
      </PowerlinesContext.Provider>
    </MetaContext.Provider>
  );
}
