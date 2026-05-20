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

import { isSetArray, isSetString } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { JsonSchemaLike, SchemaMetadata } from "./types";

const METADATA_KEYS = [
  "name",
  "title",
  "description",
  "default",
  "examples",
  "groups",
  "visibility",
  "resourceId",
  "isHidden",
  "isIgnored",
  "isInternal",
  "isRuntime",
  "isReadonly",
  "isPrimaryKey",
  "alias",
  "union"
] as const satisfies ReadonlyArray<keyof SchemaMetadata>;

/**
 * Reads Powerlines schema metadata from a JSON Schema fragment.
 *
 * @remarks
 * Metadata may live on the schema root (JSON Schema style) or under a legacy
 * `metadata` object from JTD-shaped inputs.
 */
export function getSchemaMetadata<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(schema: JsonSchemaLike | undefined | null): TMetadata | undefined {
  if (!isSetObject(schema)) {
    return undefined;
  }

  const legacy = isSetObject(schema.metadata)
    ? (schema.metadata as TMetadata)
    : undefined;
  const metadata = { ...legacy } as TMetadata;

  for (const key of METADATA_KEYS) {
    if (schema[key] !== undefined) {
      (metadata as Record<string, unknown>)[key] = schema[key];
    }
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

/**
 * Applies Powerlines schema metadata onto a JSON Schema fragment.
 */
export function applySchemaMetadata<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(
  schema: JsonSchemaLike,
  metadata: TMetadata | undefined
): JsonSchemaLike {
  if (!metadata) {
    return schema;
  }

  const result: JsonSchemaLike = { ...schema };
  for (const key of METADATA_KEYS) {
    const value = metadata[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Returns whether a JSON Schema fragment accepts `null`.
 */
export function isSchemaNullable(schema: JsonSchemaLike | undefined): boolean {
  if (!isSetObject(schema)) {
    return false;
  }

  if (schema.nullable === true) {
    return true;
  }

  const types = readSchemaTypes(schema);
  return types.includes("null");
}

/**
 * Returns whether an object property is optional (not listed in `required`).
 */
export function isPropertyOptional(
  parent: JsonSchemaLike,
  propertyName: string
): boolean {
  const required = parent.required ?? [];
  return !required.includes(propertyName);
}

/**
 * Normalises the JSON Schema `type` keyword to a string array.
 */
export function readSchemaTypes(schema: JsonSchemaLike): string[] {
  if (Array.isArray(schema.type)) {
    return schema.type.filter(isSetString);
  }
  if (isSetString(schema.type)) {
    return [schema.type];
  }
  return [];
}

/**
 * Returns the primary non-null JSON Schema type name for a fragment.
 */
export function getPrimarySchemaType(
  schema: JsonSchemaLike | undefined
): string | undefined {
  if (!isSetObject(schema)) {
    return undefined;
  }

  return readSchemaTypes(schema).find(type => type !== "null");
}
