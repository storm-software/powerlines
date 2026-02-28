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

import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import { JitiOptions, createJiti } from "jiti";
import { ResolvedConfig, Resolver } from "../../types";

export type CreateResolverOptions = Omit<
  JitiOptions,
  "fsCache" | "moduleCache" | "interopDefault"
> &
  Pick<ResolvedConfig, "mode" | "logLevel" | "skipCache"> & {
    workspaceRoot: string;
    root: string;
    cacheDir: string;
  };

/**
 * Create a Jiti resolver for the given workspace and project root.
 *
 * @param options - The options for creating the resolver.
 * @returns A Jiti instance configured for the specified workspace and project root.
 */
function resolveOptions(options: CreateResolverOptions): JitiOptions {
  return defu(options, {
    interopDefault: true,
    fsCache:
      options.mode !== "development"
        ? joinPaths(options.cacheDir, "jiti")
        : false,
    moduleCache: options.mode !== "development"
  });
}

/**
 * Create a Jiti resolver for the given workspace and project root.
 *
 * @param options - The options for creating the resolver.
 * @returns A Jiti instance configured for the specified workspace and project root.
 */
export function createResolver(options: CreateResolverOptions): Resolver {
  const baseResolver = createJiti(
    joinPaths(options.workspaceRoot, options.root),
    resolveOptions(options)
  ) as Resolver;
  baseResolver.plugin = createJiti(
    joinPaths(options.workspaceRoot, options.root),
    resolveOptions(options)
  );

  return baseResolver;
}
