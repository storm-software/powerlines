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

import { match } from "bundle-require";
import type { ExternalIdResult } from "unplugin";
import type { Context } from "../../types/context";

// Must not start with "/" or "./" or "../" or "C:\" or be the exact strings ".." or "."
const NON_NODE_MODULE_REGEX = /^[A-Z]:[/\\]|^\.{0,2}\/|^\.{1,2}$/;

export interface ResolveIdArgs {
  id: string;
  importer: string | undefined;
  options: {
    isEntry: boolean;
  };
}

export interface ResolveIdOptions {
  skipResolve?: boolean;
  skipNodeModulesBundle?: boolean;
  external: (string | RegExp)[];
  noExternal: (string | RegExp)[];
  resolvePatterns: (string | RegExp)[];
}

/**
 * Handle the resolveId hook for the unplugin.
 *
 * @param context - The plugin context.
 * @param args - The arguments for the hook.
 * @param options - The options for the hook.
 * @returns The resolved id or null if not found.
 */
export async function handleResolveId(
  context: Context,
  args: ResolveIdArgs,
  options: Partial<ResolveIdOptions> = {}
): Promise<ExternalIdResult | null | undefined> {
  if (args.id) {
    if (
      context.fs.isVirtual(args.id) ||
      (args.importer &&
        context.fs.isVirtual(args.id, {
          paths: [args.importer]
        }))
    ) {
      const resolvedPath = args.importer
        ? context.fs.resolve(args.id, {
            paths: [args.importer]
          })
        : context.fs.resolve(args.id);
      if (resolvedPath) {
        return {
          id: resolvedPath,
          external: context.config.projectType !== "application"
        };
      }
    }

    if (context.fs.isTsconfigPath(args.id)) {
      const tsconfigPath = context.fs.resolveTsconfigPath(args.id);
      const tsconfigPathPackage = context.fs.resolveTsconfigPathPackage(
        args.id
      );
      if (tsconfigPath && tsconfigPathPackage) {
        return {
          id: tsconfigPath,
          external: Boolean(
            !options.noExternal?.includes(tsconfigPathPackage) &&
              (options.external?.includes(tsconfigPathPackage) ??
                context.config.projectType !== "application")
          )
        };
      }
    }

    if (options.skipResolve) {
      return undefined;
    }

    if (options.skipNodeModulesBundle) {
      if (
        match(args.id, options.resolvePatterns) ||
        match(args.id, options.noExternal) ||
        args.id.startsWith("internal:") ||
        args.id.startsWith("virtual:")
      ) {
        return undefined;
      }

      if (match(args.id, options.external) || args.id.startsWith("node:")) {
        return { id: args.id, external: true };
      }

      // Exclude any other import that looks like a Node module
      if (!NON_NODE_MODULE_REGEX.test(args.id)) {
        return {
          id: args.id,
          external: true
        };
      }
    } else {
      const resolvedPath = context.fs.resolve(args.id, {
        paths: args.importer ? [args.importer] : []
      });
      if (
        match(args.id, options.noExternal) ||
        (resolvedPath && context.fs.meta[resolvedPath]?.variant === "builtin")
      ) {
        return undefined;
      }

      if (match(args.id, options.external) || args.id.startsWith("node:")) {
        return { id: args.id, external: true };
      }
    }
  }

  return undefined;
}
