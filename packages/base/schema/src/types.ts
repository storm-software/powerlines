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

import { Type } from "@powerlines/deepkit/vendor/type";
import type { StandardJSONSchemaV1 } from "@standard-schema/spec";
import { JsonSchemaType } from "@stryke/json/types";
import type { TypeDefinition } from "@stryke/types/configuration";
import { JTDSchemaType } from "ajv/dist/types/jtd-schema";
import { InputObject, Schema as _Schema } from "untyped";
import * as z3 from "zod/v3";

export type UntypedInputObject = InputObject;
export type UntypedSchema = _Schema;

/**
 * The set of numeric `type` strings supported by JSON Type Definition (RFC 8927).
 */
export type JtdNumberType =
  | "float32"
  | "float64"
  | "int8"
  | "uint8"
  | "int16"
  | "uint16"
  | "int32"
  | "uint32";

/**
 * The set of `type` strings supported by JSON Type Definition (RFC 8927).
 */
export type JtdType = JtdNumberType | "string" | "timestamp" | "boolean";

export interface JsonSchemaLike {
  type?: string | string[];
  format?: string;
  enum?: unknown[];
  const?: unknown;
  items?: JsonSchemaLike | JsonSchemaLike[];
  properties?: Record<string, JsonSchemaLike>;
  patternProperties?: Record<string, JsonSchemaLike>;
  additionalProperties?: boolean | JsonSchemaLike;
  required?: string[];
  anyOf?: JsonSchemaLike[];
  oneOf?: JsonSchemaLike[];
  allOf?: JsonSchemaLike[];
  $ref?: string;
  description?: string;
  title?: string;
  default?: unknown;
  examples?: unknown[];
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  nullable?: boolean;
  definitions?: Record<string, JsonSchemaLike>;
  $defs?: Record<string, JsonSchemaLike>;
  discriminator?: { propertyName?: string } | string;
  [key: string]: unknown;
}

export type SchemaSourceVariant =
  | "standard-schema"
  | "jtd-schema"
  | "json-schema"
  | "zod3"
  | "untyped"
  | "reflection";

export type SchemaInputVariant = SchemaSourceVariant | "type-definition";

export type SchemaSourceInput<
  T = unknown,
  D extends Record<string, unknown> = Record<string, unknown>
> =
  | StandardJSONSchemaV1
  | JTDSchemaType<T, D>
  | JsonSchemaType
  | z3.ZodTypeAny
  | UntypedInputObject
  | UntypedSchema
  | Type;

export type TypeDefinitionReference = TypeDefinition | string;

export type SchemaInput = SchemaSourceInput | Schema | TypeDefinitionReference;

export interface Schema<
  T = unknown,
  D extends Record<string, unknown> = Record<string, unknown>
> {
  hash: string;
  variant: SchemaInputVariant;
  schema: JTDSchemaType<T, D>;
}

export interface BaseSchemaSource {
  hash: string;
  variant: SchemaSourceVariant;
  schema: SchemaSourceInput;
}

export interface JTDSchemaSchemaSource<
  T = unknown,
  D extends Record<string, unknown> = Record<string, unknown>
> extends BaseSchemaSource {
  variant: "jtd-schema";
  schema: JTDSchemaType<T, D>;
}

export interface JsonSchemaSchemaSource extends BaseSchemaSource {
  variant: "json-schema";
  schema: JsonSchemaType;
}

export interface StandardSchemaSchemaSource extends BaseSchemaSource {
  variant: "standard-schema";
  schema: StandardJSONSchemaV1;
}

export interface Zod3SchemaSource extends BaseSchemaSource {
  variant: "zod3";
  schema: z3.ZodTypeAny;
}

export interface ReflectionSchemaSource extends BaseSchemaSource {
  variant: "reflection";
  schema: Type;
}

export interface UntypedSchemaSource extends BaseSchemaSource {
  variant: "untyped";
  schema: UntypedInputObject | UntypedSchema;
}

export type SchemaSource =
  | JsonSchemaSchemaSource
  | JTDSchemaSchemaSource
  | StandardSchemaSchemaSource
  | Zod3SchemaSource
  | UntypedSchemaSource
  | ReflectionSchemaSource;

export interface ExtractedSchema<
  T = unknown,
  D extends Record<string, unknown> = Record<string, unknown>
> extends Schema<T, D> {
  source: SchemaSource;
}
