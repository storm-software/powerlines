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

import type {
  CreateUnpluginResolverOptions,
  ResolveOptions,
  UnresolvedContext
} from "@powerlines/core";
import { createUnpluginResolver } from "@powerlines/core/lib/unplugin";
import { resolveOptions } from "@powerlines/unplugin/rolldown";
import { toArray } from "@stryke/convert/to-array";
import { omit } from "@stryke/helpers/omit";
import { findFileName } from "@stryke/path/file-path-fns";
import { DeepPartial } from "@stryke/types/base";
import defu from "defu";
import type { BuildOptions, OutputChunk } from "rolldown";
import { build } from "rolldown";
import { createRolldownPlugin } from "unplugin";

export type BundleOptions = DeepPartial<
  Omit<BuildOptions, "input" | "write">
> & {
  name?: string;
  resolve?: DeepPartial<ResolveOptions>;
};

/**
 * Bundle a type definition to a module.
 *
 * @param context - The context object containing the environment paths.
 * @param file - The file path to bundle.
 * @param options - Optional overrides for the Rolldown configuration.
 * @returns A promise that resolves to the bundled module.
 */
export async function bundle<TContext extends UnresolvedContext>(
  context: TContext,
  file: string,
  options: BundleOptions = {}
): Promise<OutputChunk> {
  const path = await context.fs.resolve(file);
  if (!path || !context.fs.existsSync(path)) {
    throw new Error(
      `Module not found: "${file}". Please check the path and try again.`
    );
  }

  const userOptions = omit(options, ["name", "resolve", "plugins"]);
  const plugins = await Promise.resolve(options.plugins);

  const resolvedOptions = resolveOptions(context);

  const result = await build({
    bundle: true,
    platform: "node",
    ...resolvedOptions,
    ...userOptions,
    logLevel: "silent",
    output: {
      dir: context.config.output.path,
      format: "es",
      sourcemap: false,
      codeSplitting: false,
      minify: false,
      keepNames: true,
      exports: "named",
      ...userOptions.output
    },
    input: [path],
    write: false,
    plugins: [
      ...(plugins ? toArray(plugins) : []),
      createRolldownPlugin(
        createUnpluginResolver(context, {
          name: options.name ?? `${findFileName(file)} Bundler`,
          prefix: false,
          overrides: defu(
            options.resolve ?? {},
            { skipNodeModulesBundle: false },
            context.config.resolve
          ) as CreateUnpluginResolverOptions["overrides"],
          silenceHookLogging: true
        })
      )()
    ].filter(Boolean)
  } as BuildOptions);
  if (!result.output || result.output.length === 0) {
    throw new Error(
      `No output files generated for ${
        file
      }. Please check the configuration and try again.`
    );
  }
  if (result.output.length > 1) {
    context.warn(
      `Multiple output files generated for "${
        file
      }". Only the first file will be used. Please check the configuration to ensure only one output file is generated.`
    );
  }

  return result.output[0];
}
