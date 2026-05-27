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

import type { PluginContext, UnresolvedContext } from "@powerlines/core";
import { esbuildPlugin } from "@powerlines/deepkit/esbuild-plugin";
import { reflect, Type } from "@powerlines/deepkit/vendor/type";
import { extractFileReference } from "@stryke/convert/extract-file-reference";
import { findFileDotExtension, findFileExtensionSafe } from "@stryke/path/find";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { FileReference, FileReferenceInput } from "@stryke/types/configuration";
import defu from "defu";
import { parse as parseToml } from "smol-toml";
import { parse as parseYaml } from "yaml";
import { bundle, BundleOptions } from "./bundle";

/**
 * Compiles a type definition to a module and returns the module.
 *
 * @param context - The context object containing the environment paths.
 * @param type - The type definition to compile. This can be either a string or a {@link FileReference} object.
 * @param overrides - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the compiled module.
 */
export async function resolveModule<
  TResult,
  TContext extends UnresolvedContext = UnresolvedContext
>(
  context: TContext,
  type: FileReference,
  overrides?: BundleOptions
): Promise<TResult> {
  let typeDefinition!: FileReference;
  if (isSetString(type)) {
    typeDefinition = extractFileReference(type) as FileReference;
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
 * @param input - The type definition to compile. This can be either a string or a {@link FileReference} object.
 * @param options - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the compiled module.
 */
export async function resolve<
  TResult,
  TContext extends UnresolvedContext = UnresolvedContext
>(
  context: TContext,
  input: FileReferenceInput,
  options?: BundleOptions
): Promise<TResult> {
  const fileReference = extractFileReference(input);
  if (!fileReference) {
    throw new Error(
      `Failed to extract a file reference from the provided input. The input must be a string or an object with a "file" property that specifies the file path and optional export name.`
    );
  }

  const extension = findFileExtensionSafe(fileReference.file);
  if (extension.startsWith("json")) {
    try {
      const json = await context.fs.read(fileReference.file);
      if (!isSetString(json)) {
        throw new Error(
          `The file at "${fileReference.file}" could not be read as a string. Please ensure the file exists and contains valid JSON.`
        );
      }

      return JSON.parse(json) as TResult;
    } catch (error) {
      throw new Error(
        `Failed to read or parse the JSON file at "${fileReference.file}". Please ensure the file exists and contains valid JSON. Error: ${(error as Error).message}`
      );
    }
  } else if (extension === "yaml" || extension === "yml") {
    try {
      const yaml = await context.fs.read(fileReference.file);
      if (!isSetString(yaml)) {
        throw new Error(
          `The file at "${fileReference.file}" could not be read as a string. Please ensure the file exists and contains valid YAML.`
        );
      }

      return parseYaml(yaml) as TResult;
    } catch (error) {
      throw new Error(
        `Failed to read or parse the YAML file at "${fileReference.file}". Please ensure the file exists and contains valid YAML. Error: ${(error as Error).message}`
      );
    }
  } else if (extension === "toml") {
    try {
      const toml = await context.fs.read(fileReference.file);
      if (!isSetString(toml)) {
        throw new Error(
          `The file at "${fileReference.file}" could not be read as a string. Please ensure the file exists and contains valid TOML.`
        );
      }

      return parseToml(toml) as TResult;
    } catch (error) {
      throw new Error(
        `Failed to read or parse the TOML file at "${fileReference.file}". Please ensure the file exists and contains valid TOML. Error: ${(error as Error).message}`
      );
    }
  }

  const resolved = await resolveModule<Record<string, any>, TContext>(
    context,
    fileReference,
    options
  );

  let exportName = fileReference.export;
  if (!exportName) {
    exportName = "default";
  }

  const resolvedExport = resolved[exportName] ?? resolved[`__Ω${exportName}`];
  if (resolvedExport === undefined) {
    throw new Error(
      `The export "${exportName}" could not be resolved in the "${
        fileReference.file
      }" module. ${
        Object.keys(resolved).length === 0
          ? `After bundling, no exports were found in the module. Please ensure that the "${
              fileReference.file
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
 * @param input - The type definition to compile. This can be either a string or a {@link FileReference} object.
 * @param options - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the Deepkit Type reflection.
 */
export async function resolveReflection<
  TContext extends PluginContext = PluginContext
>(
  context: TContext,
  input: FileReference,
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
