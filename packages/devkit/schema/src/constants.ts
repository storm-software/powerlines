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

import { SchemaMetadata } from "./types";

export const JsonSchemaTypes = {
  STRING: "string",
  NUMBER: "number",
  INTEGER: "integer",
  BOOLEAN: "boolean",
  NULL: "null",
  OBJECT: "object",
  ARRAY: "array"
} as const;

export const JSON_SCHEMA_DATA_TYPES = [
  JsonSchemaTypes.STRING,
  JsonSchemaTypes.NUMBER,
  JsonSchemaTypes.INTEGER,
  JsonSchemaTypes.BOOLEAN,
  JsonSchemaTypes.ARRAY,
  JsonSchemaTypes.OBJECT,
  JsonSchemaTypes.NULL
] as const;

export const JSON_SCHEMA_METADATA_KEYS = [
  "name",
  "title",
  "description",
  "default",
  "examples",
  "groups",
  "visibility",
  "isHidden",
  "isIgnored",
  "isInternal",
  "isRuntime",
  "isReadonly",
  "isPrimaryKey",
  "alias"
] satisfies ReadonlyArray<keyof SchemaMetadata>;
