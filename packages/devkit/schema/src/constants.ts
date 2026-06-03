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

import type { JsonSchemaMetadataKeywords } from "./types";

export const VALID_SOURCE_FILE_EXTENSIONS = [
  "ts",
  "cts",
  "mts",
  "tsx",
  "js",
  "cjs",
  "mjs",
  "jsx",
  "json",
  "jsonc",
  "json5",
  "yaml",
  "yml",
  "toml"
] as const as string[];

export const JsonSchemaTypeNames = {
  STRING: "string",
  NUMBER: "number",
  INTEGER: "integer",
  BOOLEAN: "boolean",
  NULL: "null",
  OBJECT: "object",
  ARRAY: "array"
} as const;

export const JSON_SCHEMA_PRIMITIVE_TYPES = [
  JsonSchemaTypeNames.STRING,
  JsonSchemaTypeNames.NUMBER,
  JsonSchemaTypeNames.INTEGER,
  JsonSchemaTypeNames.BOOLEAN,
  JsonSchemaTypeNames.NULL
] as const;

export const JSON_SCHEMA_TYPES = [
  ...JSON_SCHEMA_PRIMITIVE_TYPES,
  JsonSchemaTypeNames.ARRAY,
  JsonSchemaTypeNames.OBJECT
] as const;

export const JSON_SCHEMA_METADATA_KEYS = [
  "docs",
  "deprecated",
  "title",
  "description",
  "examples",
  "hidden",
  "ignore",
  "internal",
  "runtime",
  "readOnly",
  "writeOnly",
  "alias",
  "tags"
] satisfies ReadonlyArray<keyof JsonSchemaMetadataKeywords>;

/**
 * Keywords whose values are a flat record of named JSON Schema fragments.
 * Each child schema is merged recursively with its counterpart.
 */
export const SCHEMA_RECORD_KEYWORDS = new Set([
  "properties",
  "patternProperties",
  "$defs",
  "definitions",
  "dependentSchemas"
]);

/**
 * Keywords whose value is a single JSON Schema fragment that should be
 * recursively merged when both sides define it.
 */
export const SCHEMA_SINGLE_KEYWORDS = new Set([
  "if",
  "then",
  "else",
  "not",
  "contains",
  "items",
  "additionalProperties",
  "unevaluatedProperties",
  "propertyNames",
  "unevaluatedItems"
]);

/**
 * Keywords whose values are arrays of JSON Schema fragments that should be
 * concatenated (rather than overridden) during a merge.
 */
export const SCHEMA_ARRAY_CONCAT_KEYWORDS = new Set([
  "allOf",
  "anyOf",
  "oneOf"
]);
