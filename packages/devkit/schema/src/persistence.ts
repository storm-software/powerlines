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

import type { Context } from "@powerlines/core";
import { joinPaths } from "@stryke/path/join";
import { extractHash, extractVariant } from "./extract";
import { isSchema } from "./type-checks";
import { Schema, SchemaInput } from "./types";

/**
 * A helper function to get the cache directory path for storing schemas. This function takes a context object as input and returns the path to the cache directory where schemas are stored. The cache directory is constructed by joining the `cachePath` property from the context with a subdirectory named "schemas". This function is useful for centralizing the logic for determining where schema files should be cached, ensuring that all schema-related file operations use a consistent location for storing and retrieving cached schemas.
 *
 * @param context - The context object providing access to the cache path.
 * @returns The path to the cache directory for storing schemas, constructed by joining the context's `cachePath` with the "schemas" subdirectory.
 */
export function getCacheDirectory(context: Context): string {
  return joinPaths(context.cachePath, "schemas");
}

/**
 * A helper function to get the file path for a cached schema based on the provided context and schema input. This function first extracts the variant and hash from the input schema using the `extractVariant` and `extractHash` functions, respectively. It then constructs the file path to the cached schema JSON file by joining the cache directory path (obtained from the `getCacheDirectory` function) with a filename derived from the extracted hash. The resulting file path points to where the cached schema should be stored or retrieved from in the file system. This function is essential for ensuring that all operations related to caching schemas use a consistent method for determining the correct file path based on the schema's unique identifier (hash).
 *
 * @param context - The context object providing access to the cache path.
 * @param input - The input schema from which to extract the variant and hash for constructing the cache file path.
 * @returns The file path to the cached schema JSON file, constructed by joining the cache directory path with a filename derived from the extracted hash of the schema input.
 */
export function getCacheFilePath<T = unknown>(
  context: Context,
  input: SchemaInput<T>
): string {
  const variant = extractVariant(input);
  const hash = extractHash(variant, input);

  return joinPaths(getCacheDirectory(context), `${hash}.json`);
}

/**
 * Writes a given schema to the file system using the provided context. This function first checks if the input is a valid schema using the `isSchema` type guard. If the input is not a valid schema, it throws an error indicating that the provided input is invalid. If the input is valid, it proceeds to write the schema to a JSON file in the cache directory specified by the context. The file is named using the hash of the schema to ensure uniqueness and easy retrieval in future operations. The schema is serialized to JSON format before being written to the file system. This function is asynchronous and returns a promise that resolves once the writing operation is complete.
 *
 * @param context - The context object providing access to the file system and cache path.
 * @param schema - The schema to be written to the file system, which must be a valid schema object containing a `variant`, `schema`, and `hash` property.
 * @throws Will throw an error if the provided input is not a valid schema.
 */
export async function writeSchema<T = unknown>(
  context: Context,
  schema: Schema<T>
) {
  if (!isSchema<T>(schema)) {
    throw new Error(
      `The provided input is not a valid schema. A valid schema must have a "variant" property indicating the type of the input and a "schema" property containing the parsed JSON Schema object.`
    );
  }

  await context.fs.write(
    getCacheFilePath(context, schema),
    JSON.stringify(schema.schema)
  );
}

/**
 * A helper function to read a schema from the file system using the provided context. This function first extracts the variant and hash from the input schema using the `extractVariant` and `extractHash` functions, respectively. It then constructs the file path to the cached schema JSON file based on the cache path provided in the context and the extracted hash. The function checks if the file exists in the cache; if it does not exist, it returns `undefined`. If the file exists, it reads the contents of the file, parses it as JSON, and returns the resulting object. This function is asynchronous and returns a promise that resolves to either the parsed schema object or `undefined` if the schema is not found in the cache.
 *
 * @param context - The context object providing access to the file system and cache path.
 * @param input - The input schema from which to extract the variant and hash for locating the cached schema file.
 * @returns A promise that resolves to the parsed schema object if found in the cache, or `undefined` if the schema does not exist in the cache.
 */
export async function readSchemaSafe<T = unknown>(
  context: Context,
  input: SchemaInput<T>
): Promise<Schema<T> | undefined> {
  const cacheFilePath = getCacheFilePath(context, input);
  if (!(await context.fs.exists(cacheFilePath))) {
    return undefined;
  }

  const data = await context.fs.read(cacheFilePath);
  if (!data) {
    return undefined;
  }

  return JSON.parse(data);
}

/**
 * Reads a schema from the file system using the provided context and input. This function first attempts to read the schema using the `readSchemaSafe` helper function, which returns `undefined` if the schema is not found in the cache. If the schema is not found, this function throws an error indicating that the schema with the specified variant and hash does not exist in the cache. The error message suggests that this may be due to a missing or corrupted cache file, or because the schema has not been written to the cache yet. It advises ensuring that the schema is properly written to the cache before attempting to read it. If the schema is successfully read from the cache, it is returned as a parsed object. This function is asynchronous and returns a promise that resolves to the parsed schema object if found, or throws an error if the schema is not found in the cache.
 *
 * @param context - The context object providing access to the file system and cache path.
 * @param input - The input schema from which to extract the variant and hash for locating the cached schema file.
 * @returns A promise that resolves to the parsed schema object if found in the cache, or throws an error if the schema does not exist in the cache.
 * @throws Will throw an error if the schema with the specified variant and hash does not exist in the cache.
 */
export async function readSchema<T = unknown>(
  context: Context,
  input: SchemaInput<T>
): Promise<Schema<T>> {
  const schema = await readSchemaSafe<T>(context, input);
  if (!schema) {
    const variant = extractVariant(input);
    const hash = extractHash(variant, input);

    throw new Error(
      `The ${variant} schema with hash "${
        hash
      }" does not exist in the cache. This may be due to a missing or corrupted cache file, or because the schema has not been written to the cache yet. Please ensure that the schema is properly written to the cache before attempting to read it.`
    );
  }

  return schema;
}
