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

import { Context } from "../types/context";

/**
 * Determine if a module ID is a built-in Powerlines module ID.
 *
 * @param context - The Powerlines context.
 * @param moduleName - The name of the module to check.
 * @returns `true` if the module is a built-in module, otherwise `false`.
 */
export function isBuiltinModule(context: Context, moduleName: string): boolean {
  const prefix: string = context.config?.framework || "powerlines";

  return (
    moduleName.startsWith(`${prefix.replace(/:$/, "")}:`) ||
    Object.keys(context.fs.metadata)
      .filter(key => context.fs.metadata[key]?.type === "builtin")
      .includes(moduleName)
  );
}
