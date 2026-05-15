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

import { PluginContext, UnresolvedContext } from "@powerlines/core";
import { esbuildPlugin } from "@powerlines/deepkit/esbuild-plugin";
import { reflect, Type } from "@powerlines/deepkit/vendor/type";
import { parseTypeDefinition } from "@stryke/convert/parse-type-definition";
import { findFileDotExtension } from "@stryke/path/find";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { TypeDefinition } from "@stryke/types/configuration";
import defu from "defu";
import { bundle, BundleOptions } from "./bundle";
import { TypeDefinitionReference } from "./types";

/**
 * Compiles a type definition to a module and returns the module.
 *
 * @param context - The context object containing the environment paths.
 * @param type - The type definition to compile. This can be either a string or a {@link TypeDefinition} object.
 * @param overrides - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the compiled module.
 */
export async function resolveModule<
  TResult,
  TContext extends UnresolvedContext = UnresolvedContext
>(
  context: TContext,
  type: TypeDefinitionReference,
  overrides?: BundleOptions
): Promise<TResult> {
  let typeDefinition!: TypeDefinition;
  if (isSetString(type)) {
    typeDefinition = parseTypeDefinition(type) as TypeDefinition;
  } else {
    typeDefinition = type;
  }

  const result = await bundle<TContext>(
    context,
    typeDefinition.file,
    overrides
  );

  let resolved: any;
  try {
    resolved = await context.resolver.evalModule(result.text, {
      filename: result.path,
      ext: findFileDotExtension(result.path)
    });
  } catch (error) {
    if (
      isSetString((error as Error).message) &&
      new RegExp(
        `Cannot find module '${context.config.framework?.name || "powerlines"}:.*'`
      ).test((error as Error).message)
    ) {
      const moduleName = (error as Error).message.match(
        new RegExp(
          `Cannot find module '(${context.config.framework?.name || "powerlines"}:.*)'`
        )
      )?.[1];
      throw new Error(
        `The module "${moduleName}" could not be resolved while evaluating "${
          typeDefinition.file
        }". It is possible the required built-in modules have not yet been generated. Please check the order of your plugins. ${
          context.config.logLevel.general === "debug" ||
          context.config.logLevel.general === "trace"
            ? `

Bundle output for module:
${result.text}`
            : ""
        }`
      );
    }

    throw new Error(
      `Failed to evaluate the bundled module for "${
        typeDefinition.file
      }". Error: ${(error as Error).message}${
        context.config.logLevel.general === "debug" ||
        context.config.logLevel.general === "trace"
          ? `

Bundle output for module:
${result.text}`
          : ""
      }`
    );
  }

  return resolved;
}

/**
 * Compiles a type definition to a module and returns the specified export from the module.
 *
 * @param context - The context object containing the environment paths.
 * @param input - The type definition to compile. This can be either a string or a {@link TypeDefinition} object.
 * @param options - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the compiled module.
 */
export async function resolve<
  TResult,
  TContext extends UnresolvedContext = UnresolvedContext
>(
  context: TContext,
  input: TypeDefinitionReference,
  options?: BundleOptions
): Promise<TResult> {
  let typeDefinition!: TypeDefinition;
  if (isSetString(input)) {
    typeDefinition = parseTypeDefinition(input) as TypeDefinition;
  } else {
    typeDefinition = input;
  }

  const resolved = await resolveModule<Record<string, any>, TContext>(
    context,
    typeDefinition,
    options
  );

  let exportName = typeDefinition.name;
  if (!exportName) {
    exportName = "default";
  }

  const resolvedExport = resolved[exportName] ?? resolved[`__Ω${exportName}`];
  if (resolvedExport === undefined) {
    throw new Error(
      `The export "${exportName}" could not be resolved in the "${
        typeDefinition.file
      }" module. ${
        Object.keys(resolved).length === 0
          ? `After bundling, no exports were found in the module. Please ensure that the "${
              typeDefinition.file
            }" module has a "${exportName}" export with the desired value.`
          : `After bundling, the available exports were: ${Object.keys(
              resolved
            ).join(
              ", "
            )}. Please ensure that the export exists and is correctly named.`
      }`
    );
  }

  return resolvedExport;
}

/**
 * Resolves a type definition to a Deepkit Type reflection. This function compiles the provided type definition to a module, evaluates the module to get the specified export, and then reflects the export to get its Deepkit Type reflection.
 *
 * @param context - The context object containing the environment paths.
 * @param input - The type definition to compile. This can be either a string or a {@link TypeDefinition} object.
 * @param options - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the Deepkit Type reflection.
 */
export async function resolveReflection<
  TContext extends PluginContext = PluginContext
>(
  context: TContext,
  input: TypeDefinitionReference,
  options?: BundleOptions
): Promise<Type> {
  return reflect(
    await resolve<Type>(
      context,
      input,
      defu(options, {
        plugins: [
          esbuildPlugin(context, {
            reflection: "default",
            level: "all"
          })
        ]
      })
    )
  );
}
