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
import { isFile } from "@stryke/fs/is-file";
import { listFiles, listFilesSync } from "@stryke/fs/list-files";
import { murmurhash } from "@stryke/hash/murmurhash";
import { getUniqueBy } from "@stryke/helpers/get-unique";
import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type {
  TypeDefinition,
  TypeDefinitionParameter
} from "@stryke/types/configuration";
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
    joinPaths(
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
      )
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
  typeDefinitions: TypeDefinitionParameter[]
): Promise<ResolvedEntryTypeDefinition[]> {
  return (
    await Promise.all(
      typeDefinitions.map(async typeDefinition => {
        const parsed = parseTypeDefinition(typeDefinition)!;

        const filePath = appendPath(parsed.file, context.config.projectRoot);
        if (isFile(filePath)) {
          return resolveEntry(context, {
            file: replacePath(filePath, context.config.projectRoot),
            name: parsed.name
          });
        }

        return (
          await listFiles(appendPath(parsed.file, context.config.projectRoot))
        ).map(file =>
          resolveEntry(context, {
            file,
            name: parsed.name
          })
        );
      })
    )
  )
    .flat()
    .filter(Boolean);
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
  typeDefinitions: TypeDefinitionParameter[]
): ResolvedEntryTypeDefinition[] {
  return typeDefinitions
    .map(typeDefinition => {
      const parsed = parseTypeDefinition(typeDefinition)!;

      const filePath = appendPath(parsed.file, context.config.projectRoot);
      if (isFile(filePath)) {
        return resolveEntry(context, {
          file: replacePath(filePath, context.config.projectRoot),
          name: parsed.name
        });
      }

      return listFilesSync(filePath).map(file =>
        resolveEntry(context, {
          file,
          name: parsed.name
        })
      );
    })
    .flat()
    .filter(Boolean);
}

/** Resolve a virtual entry point by generating a unique file path in the artifacts directory.
 *
 * @param context - The current context
 * @param typeDefinition - The type definition to resolve.
 * @returns The resolved entry type definition with a unique virtual file path.
 */
export function resolveVirtualEntry(
  context: Context,
  typeDefinition: TypeDefinitionParameter
): ResolvedEntryTypeDefinition {
  const parsed = parseTypeDefinition(typeDefinition)!;
  const resolved = resolveEntry(context, parsed);
  const file = joinPaths(
    context.artifactsPath,
    `entry-${murmurhash(
      { file: resolved.file, name: resolved.name },
      { maxLength: 24 }
    )
      .replaceAll("-", "0")
      .replaceAll("_", "1")}.ts`
  );

  return {
    file,
    name: resolved.name,
    input: {
      file,
      name: resolved.name
    },
    output: file
  };
}

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
