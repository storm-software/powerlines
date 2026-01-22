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

import defu from "defu";
import { build, BuildOptions, OutputFile } from "esbuild";
import { createEsbuildPlugin } from "unplugin";
import { ESBuildResolvedBuildConfig } from "../../types/build";
import { PluginContext } from "../../types/context";
import { extractESBuildConfig } from "../build/esbuild";
import { createUnplugin } from "../unplugin/plugin";

// const externalBuiltinsPlugin = async (context: Context): Promise<Plugin> => {
//   const builtins = await context.getBuiltins();

//   return {
//     name: `powerlines:external-builtins`,
//     setup(build) {
//       build.onResolve(
//         {
//           filter: new RegExp(`^${context.config.framework || "powerlines"}:.*`)
//         },
//         async (args: OnResolveArgs) => {
//           const found = builtins.find(
//             builtin =>
//               builtin.id === args.path ||
//               builtin.id ===
//                 args.path.replace(
//                   new RegExp(`^${context.config.framework || "powerlines"}:`),
//                   ""
//                 ) ||
//               builtin.path === args.path
//           );
//           if (found) {
//             return {
//               path: found.id,
//               external: false,
//               namespace: "powerlines"
//             };
//           }

//           return { external: true };
//         }
//       );
//       build.onLoad(
//         {
//           filter: /.*/,
//           namespace: "powerlines"
//         },
//         async (args: OnLoadArgs) => {
//           const found = builtins.find(
//             builtin =>
//               builtin.id === args.path ||
//               builtin.id ===
//                 args.path.replace(
//                   new RegExp(`^${context.config.framework || "powerlines"}:`),
//                   ""
//                 ) ||
//               builtin.path === args.path
//           );
//           if (!found) {
//             context.warn(
//               `Failed to load builtin module: "${
//                 args.path
//               }" during bundling - this should not happen since the \`onResolve\` hook resolves all existing built-in modules. Please ensure the built-in module "${
//                 args.path
//               }" was generated.`
//             );
//             return { contents: "", loader: "ts" };
//           }

//           return { contents: found?.code || "", loader: "ts" };
//         }
//       );
//     }
//   };
// };

/**
 * Bundle a type definition to a module.
 *
 * @param context - The context object containing the environment paths.
 * @param file - The file path to bundle.
 * @param overrides - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the bundled module.
 */
export async function bundle(
  context: PluginContext,
  file: string,
  overrides: Partial<ESBuildResolvedBuildConfig> = {}
): Promise<OutputFile> {
  const path = await context.fs.resolve(file);
  if (!path || !context.fs.existsSync(path)) {
    throw new Error(
      `Module not found: "${file}". Please check the path and try again.`
    );
  }

  // const plugin = await externalBuiltinsPlugin(context);
  const result = await build(
    defu(
      {
        ...extractESBuildConfig(context),
        entryPoints: [path],
        write: false,
        sourcemap: false,
        splitting: false,
        treeShaking: false,
        bundle: true,
        platform: "node",
        logLevel: "silent",
        ...overrides
      } as BuildOptions,
      {
        plugins: [createEsbuildPlugin(createUnplugin(context))({})]
      }
    )
  );
  if (result.errors.length > 0) {
    throw new Error(
      `Failed to bundle ${file}: ${result.errors
        .map(error => error.text)
        .join(", ")}`
    );
  }
  if (result.warnings.length > 0) {
    context.warn(
      `Warnings while bundling ${file}: ${result.warnings
        .map(warning => warning.text)
        .join(", ")}`
    );
  }
  if (!result.outputFiles || result.outputFiles.filter(Boolean).length === 0) {
    throw new Error(
      `No output files generated for ${
        file
      }. Please check the configuration and try again.`
    );
  }

  return result.outputFiles.filter(Boolean)[0]!;
}
