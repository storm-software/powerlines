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

import type { Children, PrintTreeOptions } from "@alloy-js/core";
import {
  BabelPluginResolvedConfig,
  BabelPluginUserConfig
} from "@powerlines/plugin-babel/types/plugin";
import { PluginContext } from "powerlines/types/context";

export type AlloyPluginOptions = Partial<PrintTreeOptions> & {
  /**
   * If true, the Alloy framework is used to generate Typescript output files.
   *
   * @defaultValue true
   */
  typescript?: boolean;

  /**
   * If true, the Alloy framework is used to generate JSON output files.
   *
   * @defaultValue false
   */
  json?: boolean;

  /**
   * If true, the Alloy framework is used to generate Markdown output files.
   *
   * @defaultValue false
   */
  markdown?: boolean;
};

export type AlloyPluginUserConfig = BabelPluginUserConfig & {
  alloy?: AlloyPluginOptions;
};

export type AlloyPluginResolvedConfig = BabelPluginResolvedConfig & {
  alloy: AlloyPluginOptions;
};

export type AlloyPluginContext<
  TResolvedConfig extends AlloyPluginResolvedConfig = AlloyPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  /**
   * A function to render children components within the [Alloy](https://alloy-framework.github.io) context, and write any saved content to the file system.
   *
   * @remarks
   * If the {@link children} provided to this function use the {@link PowerlinesContext} (accessible using the {@link usePowerlines} hook), it is very important that they are wrapped by the {@link Output} component. This ensures that the Powerlines context is properly provided to all child components during rendering. Since [\@alloy-js/core](https://alloy-framework.github.io) uses symbols to resolve context identifiers, failing to use the {@link Output} component will likely lead to unexpected behavior or errors during the rendering process.
   *
   * @example
   * ```tsx
   * import alloy from "@powerlines/plugin-alloy";
   * import { Output } from "@powerlines/plugin-alloy/core/components/output";
   *
   * export const plugin = () => {
   *   return [
   *      alloy(),
   *      {
   *        name: "my-plugin",
   *        async prepare() {
   *          await this.render(
   *            <Output context={this}>
   *              ...
   *            </Output>
   *          );
   *        }
   *      }
   *   ];
   * };
   * ```
   *
   * @param children - The children components to render.
   * @returns A promise that resolves when rendering is complete.
   */
  render: (children: Children) => Promise<void>;
};
