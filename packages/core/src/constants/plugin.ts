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

import { SUPPORTED_COMMANDS } from "./commands";

export const UNPLUGIN_BUILDER_VARIANTS = [
  "rollup",
  "webpack",
  "rspack",
  "vite",
  "esbuild",
  "farm",
  "unloader",
  "rolldown",
  "bun"
] as const;

export const BUILDER_VARIANTS = [
  ...UNPLUGIN_BUILDER_VARIANTS,
  "tsup",
  "tsdown",
  "unbuild"
] as const;

export const PLUGIN_NON_HOOK_FIELDS = [
  "name",
  "api",
  "enforce",
  "dedupe",
  "applyToEnvironment"
] as const;

export const PLUGIN_HOOKS_FIELDS = [
  ...SUPPORTED_COMMANDS,
  "config",
  "configEnvironment",
  "configResolved",
  "buildStart",
  "buildEnd",
  "transform",
  "load",
  "resolveId",
  "writeBundle"
] as const;

export const KNOWN_PLUGIN_FIELDS = [
  ...PLUGIN_NON_HOOK_FIELDS,
  ...PLUGIN_HOOKS_FIELDS,
  ...BUILDER_VARIANTS
] as const;
