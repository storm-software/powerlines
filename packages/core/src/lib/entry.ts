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
import { murmurhash } from "@stryke/hash/murmurhash";
import { getUniqueBy } from "@stryke/helpers/get-unique";
import { appendPath } from "@stryke/path/append";
import { isAbsolutePath } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { isObject } from "@stryke/type-checks/is-object";
import { isRegExp } from "@stryke/type-checks/is-regexp";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import type {
  TypeDefinition,
  TypeDefinitionParameter
} from "@stryke/types/configuration";
import { replacePathTokens } from "../plugin-utils/paths";
import { BaseConfig } from "../types";
import { ResolvedEntryTypeDefinition } from "../types/config";
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
              joinPaths(
                context.workspaceConfig.workspaceRoot,
                context.config.root,
                "src"
              )
            ),
            joinPaths(
              context.workspaceConfig.workspaceRoot,
              context.config.root
            )
          ),
          joinPaths(context.config.root, "src")
        ),
        context.config.root
      ),
      "src"
    )
  );
}

export function resolveEntry(
  context: Context,
  typeDefinition: TypeDefinition,
  input?: string | RegExp | TypeDefinition | undefined,
  output?: string
): ResolvedEntryTypeDefinition {
  return {
    ...typeDefinition,
    input:
      isSetString(input) || isRegExp(input)
        ? { file: String(input) }
        : typeDefinition,
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
export async function resolveEntries(
  context: Context,
  typeDefinitions: Array<TypeDefinitionParameter | ResolvedEntryTypeDefinition>
): Promise<ResolvedEntryTypeDefinition[]> {
  return (
    await Promise.all(
      typeDefinitions.map(async entry => {
        if (isResolvedEntryTypeDefinition(entry)) {
          return { ...entry, file: replacePathTokens(context, entry.file) };
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
        if (await context.fs.isFile(filePath)) {
          return resolveEntry(
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
          await context.fs.glob(
            appendPath(filePath, context.workspaceConfig.workspaceRoot)
          )
        ).map(file =>
          resolveEntry(
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
    )
  )
    .flat()
    .filter(Boolean);
}

/**
 * Checks if the provided entry is a type definition.
 *
 * @param entry - The entry to check.
 * @returns True if the entry is a type definition, false otherwise.
 */
export function isTypeDefinition(
  entry: TypeDefinitionParameter
): entry is TypeDefinition {
  return !isString(entry) && entry.file !== undefined;
}

/**
 * Checks if the provided entry is a resolved entry type definition.
 *
 * @param entry - The entry to check.
 * @returns True if the entry is a resolved entry type definition, false otherwise.
 */
export function isResolvedEntryTypeDefinition(
  entry: TypeDefinitionParameter | ResolvedEntryTypeDefinition | RegExp
): entry is ResolvedEntryTypeDefinition {
  return (
    !isRegExp(entry) &&
    isTypeDefinition(entry) &&
    (entry as ResolvedEntryTypeDefinition).output !== undefined
  );
}

/**
 * Resolves multiple type definitions into their corresponding resolved entry type definitions.
 *
 * @param context - The current context
 * @param typeDefinitions - The type definitions to resolve.
 * @returns A promise that resolves to an array of resolved entry type definitions.
 */
export function resolveEntriesSync(
  context: Context,
  typeDefinitions:
    | TypeDefinition
    | ResolvedEntryTypeDefinition
    | string
    | RegExp
    | (string | RegExp | TypeDefinition | ResolvedEntryTypeDefinition)[]
    | Record<
        string,
        string | RegExp | TypeDefinition | (string | RegExp | TypeDefinition)[]
      >
): ResolvedEntryTypeDefinition[] {
  return (
    isObject(typeDefinitions)
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
      } else if (isRegExp(entry)) {
        typeDefinition = { file: replacePathTokens(context, entry.source) };
      } else {
        typeDefinition = entry;
        typeDefinition.file = replacePathTokens(context, typeDefinition.file);
      }

      const filePath = isAbsolutePath(typeDefinition.file)
        ? typeDefinition.file
        : appendPath(typeDefinition.file, context.config.root);
      if (context.fs.isFileSync(filePath)) {
        return resolveEntry(context, {
          file: appendPath(filePath, context.workspaceConfig.workspaceRoot),
          name: typeDefinition.name
        });
      }

      return context.fs
        .globSync(appendPath(filePath, context.workspaceConfig.workspaceRoot))
        .map(file =>
          resolveEntry(context, {
            file,
            name: typeDefinition.name
          })
        );
    })
    .flat()
    .filter(Boolean);
}

/**
 * Get unique inputs from the provided list.
 *
 * @param inputs - The entry points to process.
 * @returns An array of unique inputs (by file path or content hash).
 */
export function getUniqueInputs(
  inputs: BaseConfig["input"] = []
): BaseConfig["input"] {
  return isObject(inputs)
    ? inputs
    : getUniqueBy(toArray(inputs), (item: TypeDefinitionParameter) =>
        isSetString(item) ? item : murmurhash(item ?? {}, { maxLength: 24 })
      );
}
