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

export const JsonSchemaTypes = {
  STRING: "string",
  NUMBER: "number",
  INTEGER: "integer",
  BOOLEAN: "boolean",
  NULL: "null",
  OBJECT: "object",
  ARRAY: "array"
} as const;

/** @deprecated Use {@link JsonSchemaTypes} instead. */
export const JTDTypes = {
  STRING: "string",
  TIMESTAMP: "timestamp",
  BOOLEAN: "boolean",
  FLOAT32: "float32",
  FLOAT64: "float64",
  INT8: "int8",
  UINT8: "uint8",
  INT16: "int16",
  UINT16: "uint16",
  INT32: "int32",
  UINT32: "uint32"
} as const;
