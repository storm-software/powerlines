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

import { extractFileReference } from "@stryke/convert/extract-file-reference";
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
  FileReference,
  FileReferenceParameter
} from "@stryke/types/configuration";
import { replacePathTokens } from "../plugin-utils/paths";
import {
  Config,
  ResolvedConfig,
  ResolvedEntryFileReference
} from "../types/config";
import type { UnresolvedContext } from "../types/context";

export function resolveEntryOutput<TContext extends UnresolvedContext>(
  context: TContext,
  fileReference: FileReference
): string {
  return replaceExtension(
    replacePath(
      replacePath(
        replacePath(
          replacePath(
            replacePath(
              fileReference.file,
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

export function resolveInput<TContext extends UnresolvedContext>(
  context: TContext,
  fileReference: FileReference,
  input?: FileReferenceParameter,
  output?: string
): ResolvedEntryFileReference {
  return {
    ...fileReference,
    input: isSetString(input) ? { file: String(input) } : fileReference,
    output: output || resolveEntryOutput(context, fileReference)
  };
}

/**
 * Resolves multiple file references into their corresponding resolved entry file references.
 *
 * @param context - The current context
 * @param fileReferences - The file references to resolve.
 * @returns A promise that resolves to an array of resolved entry file references .
 */
export async function resolveInputs<TContext extends UnresolvedContext>(
  context: TContext,
  fileReferences:
    | FileReferenceParameter
    | FileReferenceParameter[]
    | Record<string, FileReferenceParameter | FileReferenceParameter[]>
): Promise<ResolvedEntryFileReference[]> {
  return (
    await Promise.all(
      (isObject(fileReferences) && !isFileReference(fileReferences)
        ? Object.values(fileReferences).flat()
        : toArray(fileReferences)
      )
        .map(async entry => {
          if (isResolvedEntryFileReference(entry)) {
            return {
              ...entry,
              output: entry.output
                ? replacePathTokens(context, entry.output)
                : undefined,
              file: replacePathTokens(context, entry.file)
            };
          }

          let typeDefinition: FileReference;
          if (isString(entry)) {
            typeDefinition = extractFileReference(
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
                export: typeDefinition.export
              },
              (entry as ResolvedEntryFileReference).input,
              (entry as ResolvedEntryFileReference).output
            );
          }

          return (
            await context.fs.glob(appendPath(filePath, context.config.cwd))
          ).map(file =>
            resolveInput(
              context,
              {
                file: replacePath(file, context.config.root),
                export: typeDefinition.export
              },
              (entry as ResolvedEntryFileReference).input,
              (entry as ResolvedEntryFileReference).output
            )
          );
        })
        .flat()
        .filter(Boolean)
    )
  ).flat();
}

/**
 * Resolves multiple file references into their corresponding resolved entry file references.
 *
 * @param context - The current context
 * @param fileReferences - The file references to resolve.
 * @returns An array of resolved entry file references.
 */
export function resolveInputsSync<TContext extends UnresolvedContext>(
  context: TContext,
  fileReferences:
    | FileReferenceParameter
    | FileReferenceParameter[]
    | Record<string, FileReferenceParameter | FileReferenceParameter[]>
): ResolvedEntryFileReference[] {
  return (
    isObject(fileReferences) && !isFileReference(fileReferences)
      ? Object.values(fileReferences).flat()
      : toArray(fileReferences)
  )
    .map(entry => {
      if (isResolvedEntryFileReference(entry)) {
        return {
          ...entry,
          output: entry.output
            ? replacePathTokens(context, entry.output)
            : undefined,
          file: replacePathTokens(context, entry.file)
        };
      }

      let typeDefinition: FileReference;
      if (isString(entry)) {
        typeDefinition = extractFileReference(
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
          export: typeDefinition.export
        });
      }

      return context.fs
        .globSync(appendPath(filePath, context.config.cwd))
        .map(file =>
          resolveInput(context, {
            file,
            export: typeDefinition.export
          })
        );
    })
    .flat()
    .filter(Boolean);
}

/**
 * Checks if the provided entry is a file reference.
 *
 * @param entry - The entry to check.
 * @returns True if the entry is a file reference, false otherwise.
 */
export function isFileReference(entry: any): entry is FileReference {
  return !isString(entry) && entry.file !== undefined;
}

/**
 * Checks if the provided entry is a resolved entry file reference.
 *
 * @param entry - The entry to check.
 * @returns True if the entry is a resolved entry file reference, false otherwise.
 */
export function isResolvedEntryFileReference(
  entry: FileReferenceParameter | ResolvedEntryFileReference
): entry is ResolvedEntryFileReference {
  return (
    isFileReference(entry) &&
    (entry as ResolvedEntryFileReference).output !== undefined
  );
}

/**
 * Get unique inputs from the provided list.
 *
 * @param inputs - The entry points to process.
 * @returns An array of unique inputs (by file path or content hash).
 */
export function getUniqueInputs(
  inputs: Config["input"] = []
): ResolvedConfig["input"] {
  return isObject(inputs)
    ? inputs
    : getUniqueBy(toArray(inputs), (item: FileReferenceParameter) =>
        isSetString(item) ? item : murmurhash(item ?? {}, { maxLength: 24 })
      );
}
