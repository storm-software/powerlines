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
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import type {
  TypeDefinition,
  TypeDefinitionParameter
} from "@stryke/types/configuration";
import { replacePathTokens } from "../plugin-utils/paths";
import type { Context } from "../types/context";
import { ResolvedEntryTypeDefinition } from "../types/resolved";

export function resolveEntryInputFile(
  context: Context,
  typeDefinition: TypeDefinition
): string {
  return replacePath(
    typeDefinition.file,
    joinPaths(context.workspaceConfig.workspaceRoot, context.config.projectRoot)
  );
}

export function resolveEntryInput(
  context: Context,
  typeDefinition: TypeDefinition
): TypeDefinition {
  return {
    file: resolveEntryInputFile(context, typeDefinition),
    name: typeDefinition.name
  };
}

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
                context.config.sourceRoot
              )
            ),
            joinPaths(
              context.workspaceConfig.workspaceRoot,
              context.config.projectRoot
            )
          ),
          context.config.sourceRoot
        ),
        context.config.projectRoot
      ),
      replacePath(context.config.sourceRoot, context.config.projectRoot)
    )
  );
}

export function resolveEntry(
  context: Context,
  typeDefinition: TypeDefinition
): ResolvedEntryTypeDefinition {
  const input = resolveEntryInput(context, typeDefinition);

  return {
    ...input,
    input,
    output: resolveEntryOutput(context, typeDefinition)
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

        const filePath = appendPath(
          typeDefinition.file,
          context.config.projectRoot
        );
        if (await context.fs.isFile(filePath)) {
          return resolveEntry(context, {
            file: replacePath(filePath, context.config.projectRoot),
            name: typeDefinition.name
          });
        }

        return (
          await context.fs.glob(
            appendPath(filePath, context.workspaceConfig.workspaceRoot)
          )
        ).map(file =>
          resolveEntry(context, {
            file: replacePath(file, context.config.projectRoot),
            name: typeDefinition.name
          })
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
  entry: TypeDefinitionParameter | ResolvedEntryTypeDefinition
): entry is ResolvedEntryTypeDefinition {
  return (
    isTypeDefinition(entry) &&
    (entry as ResolvedEntryTypeDefinition).input !== undefined &&
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
  typeDefinitions: Array<TypeDefinitionParameter | ResolvedEntryTypeDefinition>
): ResolvedEntryTypeDefinition[] {
  return typeDefinitions
    .map(entry => {
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

      const filePath = appendPath(
        typeDefinition.file,
        context.config.projectRoot
      );
      if (context.fs.isFileSync(filePath)) {
        return resolveEntry(context, {
          file: replacePath(filePath, context.config.projectRoot),
          name: typeDefinition.name
        });
      }

      return context.fs
        .globSync(appendPath(filePath, context.workspaceConfig.workspaceRoot))
        .map(file =>
          resolveEntry(context, {
            file: replacePath(file, context.config.projectRoot),
            name: typeDefinition.name
          })
        );
    })
    .flat()
    .filter(Boolean);
}

// /** Resolve a virtual entry point by generating a unique file path in the artifacts directory.
//  *
//  * @param context - The current context
//  * @param typeDefinition - The type definition to resolve.
//  * @returns The resolved entry type definition with a unique virtual file path.
//  */
// export function resolveVirtualEntry(
//   context: Context,
//   typeDefinition: TypeDefinitionParameter
// ): ResolvedEntryTypeDefinition {
//   const parsed = parseTypeDefinition(typeDefinition)!;
//   const resolved = resolveEntry(context, parsed);
//   const file = joinPaths(
//     context.artifactsPath,
//     `entry-${murmurhash(
//       { file: resolved.file, name: resolved.name },
//       { maxLength: 24 }
//     )
//       .replaceAll("-", "0")
//       .replaceAll("_", "1")}.ts`
//   );

//   return {
//     file,
//     name: resolved.name,
//     input: {
//       file,
//       name: resolved.name
//     },
//     output: file
//   };
// }

/**
 * Get unique entries from the provided list.
 *
 * @param entries - The entries to process.
 * @returns An array of unique entries (by file path or content hash).
 */
export function getUniqueEntries(
  entries: TypeDefinitionParameter | TypeDefinitionParameter[] = []
): TypeDefinitionParameter[] {
  return getUniqueBy(toArray(entries), (item: TypeDefinitionParameter) =>
    isSetString(item) ? item : murmurhash(item ?? {}, { maxLength: 24 })
  );
}
