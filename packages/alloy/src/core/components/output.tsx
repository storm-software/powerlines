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
import {
  computed,
  Output as OutputExternal,
  ref,
  Show,
  splitProps
} from "@alloy-js/core";
import { replacePath } from "@stryke/path/replace";
import type { PluginContext } from "powerlines/types/context";
import { PowerlinesContext } from "../contexts/context";

export interface OutputProps<
  TContext extends PluginContext = PluginContext
> extends OutputPropsExternal {
  /**
   * The current Powerlines process context.
   */
  context: TContext;
}

/**
 * Output component for rendering the Powerlines plugin's output files via templates.
 */
export function Output<TContext extends PluginContext = PluginContext>(
  props: OutputProps<TContext>
) {
  const [{ children, context, basePath }, rest] = splitProps(props, [
    "children",
    "context",
    "basePath"
  ]);

  const contextRef = ref(context);
  const basePathRef = computed(() =>
    basePath
      ? replacePath(basePath, contextRef.value.workspaceConfig.workspaceRoot)
      : contextRef.value.workspaceConfig.workspaceRoot
  );

  return (
    <OutputExternal {...rest} basePath={basePathRef.value}>
      <PowerlinesContext.Provider value={{ ref: contextRef }}>
        <Show when={Boolean(contextRef.value)}>{children}</Show>
      </PowerlinesContext.Provider>
    </OutputExternal>
  );
}
