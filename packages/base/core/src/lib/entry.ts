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

import { parseTypeDefinition } from "@stryke/convert/parse-type-definition";
import { toArray } from "@stryke/convert/to-array";
import { murmurhash } from "@stryke/hash";
import { getUniqueBy } from "@stryke/helpers/get-unique";
import { appendPath } from "@stryke/path/append";
import { isAbsolutePath } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { isObject } from "@stryke/type-checks/is-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import type {
  TypeDefinition,
  TypeDefinitionParameter
} from "@stryke/types/configuration";
import { replacePathTokens } from "../plugin-utils/paths";
import { Config, ResolvedEntryTypeDefinition } from "../types/config";
import type { Context } from "../types/context";

export function resolveEntryOutput(
  context: Context,
  typeDefinition: TypeDefinition
): string {
  return replaceExtension(
    replacePath(
      replacePath(
        replacePath(
          replacePath(
            replacePath(
              typeDefinition.file,
              joinPaths(context.config.cwd, context.config.root, "src")
            ),
            joinPaths(context.config.cwd, context.config.root)
          ),
          joinPaths(context.config.root, "src")
        ),
        context.config.root
      ),
      "src"
    )
  );
}

export function resolveInput(
  context: Context,
  typeDefinition: TypeDefinition,
  input?: TypeDefinitionParameter,
  output?: string
): ResolvedEntryTypeDefinition {
  return {
    ...typeDefinition,
    input: isSetString(input) ? { file: String(input) } : typeDefinition,
    output: output || resolveEntryOutput(context, typeDefinition)
  };
}

/**
 * Resolves multiple type definitions into their corresponding resolved entry type definitions.
 *
 * @param context - The current context
 * @param typeDefinitions - The type definitions to resolve.
 * @returns A promise that resolves to an array of resolved entry type definitions.
 */
export async function resolveInputs(
  context: Context,
  typeDefinitions:
    | TypeDefinitionParameter
    | TypeDefinitionParameter[]
    | Record<string, TypeDefinitionParameter | TypeDefinitionParameter[]>
): Promise<ResolvedEntryTypeDefinition[]> {
  return (
    await Promise.all(
      (isObject(typeDefinitions) && !isTypeDefinition(typeDefinitions)
        ? Object.values(typeDefinitions).flat()
        : toArray(typeDefinitions)
      )
        .map(async entry => {
          if (isResolvedEntryTypeDefinition(entry)) {
            return {
              ...entry,
              output: entry.output
                ? replacePathTokens(context, entry.output)
                : undefined,
              file: replacePathTokens(context, entry.file)
            };
          }

          let typeDefinition: TypeDefinition;
          if (isString(entry)) {
            typeDefinition = parseTypeDefinition(
              replacePathTokens(context, entry)
            )!;
          } else {
            typeDefinition = entry;
            typeDefinition.file = replacePathTokens(
              context,
              typeDefinition.file
            );
          }

          const filePath = isAbsolutePath(typeDefinition.file)
            ? typeDefinition.file
            : appendPath(typeDefinition.file, context.config.root);
          if (await context.fs.isFile(filePath)) {
            return resolveInput(
              context,
              {
                file: replacePath(filePath, context.config.root),
                name: typeDefinition.name
              },
              (entry as ResolvedEntryTypeDefinition).input,
              (entry as ResolvedEntryTypeDefinition).output
            );
          }

          return (
            await context.fs.glob(appendPath(filePath, context.config.cwd))
          ).map(file =>
            resolveInput(
              context,
              {
                file: replacePath(file, context.config.root),
                name: typeDefinition.name
              },
              (entry as ResolvedEntryTypeDefinition).input,
              (entry as ResolvedEntryTypeDefinition).output
            )
          );
        })
        .flat()
        .filter(Boolean)
    )
  ).flat();
}

/**
 * Resolves multiple type definitions into their corresponding resolved entry type definitions.
 *
 * @param context - The current context
 * @param typeDefinitions - The type definitions to resolve.
 * @returns A promise that resolves to an array of resolved entry type definitions.
 */
export function resolveInputsSync(
  context: Context,
  typeDefinitions:
    | TypeDefinitionParameter
    | TypeDefinitionParameter[]
    | Record<string, TypeDefinitionParameter | TypeDefinitionParameter[]>
): ResolvedEntryTypeDefinition[] {
  return (
    isObject(typeDefinitions) && !isTypeDefinition(typeDefinitions)
      ? Object.values(typeDefinitions).flat()
      : toArray(typeDefinitions)
  )
    .map(entry => {
      if (isResolvedEntryTypeDefinition(entry)) {
        return {
          ...entry,
          output: entry.output
            ? replacePathTokens(context, entry.output)
            : undefined,
          file: replacePathTokens(context, entry.file)
        };
      }

      let typeDefinition: TypeDefinition;
      if (isString(entry)) {
        typeDefinition = parseTypeDefinition(
          replacePathTokens(context, entry)
        )!;
      } else {
        typeDefinition = entry;
        typeDefinition.file = replacePathTokens(context, typeDefinition.file);
      }

      const filePath = isAbsolutePath(typeDefinition.file)
        ? typeDefinition.file
        : appendPath(typeDefinition.file, context.config.root);
      if (context.fs.isFileSync(filePath)) {
        return resolveInput(context, {
          file: appendPath(filePath, context.config.cwd),
          name: typeDefinition.name
        });
      }

      return context.fs
        .globSync(appendPath(filePath, context.config.cwd))
        .map(file =>
          resolveInput(context, {
            file,
            name: typeDefinition.name
          })
        );
    })
    .flat()
    .filter(Boolean);
}

/**
 * Checks if the provided entry is a type definition.
 *
 * @param entry - The entry to check.
 * @returns True if the entry is a type definition, false otherwise.
 */
export function isTypeDefinition(entry: any): entry is TypeDefinition {
  return !isString(entry) && entry.file !== undefined;
}

/**
 * Checks if the provided entry is a resolved entry type definition.
 *
 * @param entry - The entry to check.
 * @returns True if the entry is a resolved entry type definition, false otherwise.
 */
export function isResolvedEntryTypeDefinition(
  entry: TypeDefinitionParameter | ResolvedEntryTypeDefinition
): entry is ResolvedEntryTypeDefinition {
  return (
    isTypeDefinition(entry) &&
    (entry as ResolvedEntryTypeDefinition).output !== undefined
  );
}

/**
 * Get unique inputs from the provided list.
 *
 * @param inputs - The entry points to process.
 * @returns An array of unique inputs (by file path or content hash).
 */
export function getUniqueInputs(inputs: Config["input"] = []): Config["input"] {
  return isObject(inputs)
    ? inputs
    : getUniqueBy(toArray(inputs), (item: TypeDefinitionParameter) =>
        isSetString(item) ? item : murmurhash(item ?? {}, { maxLength: 24 })
      );
}
