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

import { createFilter } from "@rollup/pluginutils";
import { isFunction, isString } from "@stryke/type-checks";
import { Plugin } from "powerlines";
import type { SourceMap } from "rollup";
import { unified } from "unified";
import {
  ResolvedUnifiedRule,
  UnifiedPluginContext,
  UnifiedPluginOptions
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  interface Config {
    unified?: UnifiedPluginOptions;
  }
}

/**
 * UnifiedJs Transformations Plugin
 *
 * @remarks
 * This plugin allows you to define transformations using the UnifiedJS ecosystem. You can specify rules that match certain files and apply Unified processors to transform their content. This is useful for processing markdown, HTML, or any other text-based files using Unified's powerful plugins and ecosystem.
 *
 * @see https://unified.js.org
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends UnifiedPluginContext = UnifiedPluginContext
>(
  options: UnifiedPluginOptions = {}
): Plugin<TContext>[] => {
  const resolved = (options?.rules ?? []).map((rule): ResolvedUnifiedRule => {
    return {
      ...rule,
      filter: isFunction(rule.include)
        ? rule.include
        : createFilter(rule.include, rule.exclude),
      processor: Promise.resolve(rule.setup(unified()))
    };
  });

  const pre: ResolvedUnifiedRule[] = [];
  const post: ResolvedUnifiedRule[] = [];
  const normal: ResolvedUnifiedRule[] = [];

  for (const rule of resolved) {
    if (rule.enforce === "pre") pre.push(rule);
    else if (rule.enforce === "post") post.push(rule);
    else normal.push(rule);
  }

  return [
    {
      name: "unified:config",
      config() {
        return {
          unified: {
            rules: resolved
          }
        };
      }
    },
    [pre, normal, post]
      .map((rules, idx): Plugin<TContext> | undefined => {
        const enforce = (["pre", undefined, "post"] as const)[idx];
        if (rules.length === 0) return undefined;

        return {
          name: `unified${enforce ? `:${enforce}` : ""}`,
          enforce,
          transform: {
            filter: (id: string) => rules.some(r => r.filter(id)),
            async handler(code, id) {
              const rule = rules.find(r => r.filter(id));
              if (!rule) return;

              code = (await rule.transform?.pre?.(code, id)) || code;

              const processor = await rule.processor;
              const result = await processor.process(code);

              let resultCode = result.toString();
              let resultMap = result.map;

              if (rule.transform?.post) {
                const postResult =
                  (await rule.transform.post(
                    resultCode,
                    id,
                    resultMap as SourceMap
                  )) || resultCode;
                if (isString(postResult)) {
                  resultCode = postResult;
                } else {
                  resultCode = postResult.code;
                  resultMap = postResult.map;
                }
              }

              return {
                code: resultCode,
                map: resultMap
              };
            }
          }
        };
      })
      .filter(Boolean)
  ].flat() as Plugin<TContext>[];
};

export default plugin;
