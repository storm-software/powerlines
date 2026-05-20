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
import { InputObject, Schema as _Schema } from "untyped";
import * as z3 from "zod/v3";

export type UntypedInputObject = InputObject;
export type UntypedSchema = _Schema;

/**
 * JSON Schema primitive type names used by {@link stringifyType}.
 */
export type JsonSchemaPrimitiveType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "null"
  | "object"
  | "array";

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
  metadata?: Partial<SchemaMetadata>;
  [key: string]: unknown;
}

export type SchemaType = JsonSchemaType;

export type JsonSchemaObjectType<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> = JsonSchemaType & {
  type: "object";
  properties: Record<string, JsonSchemaType>;
  required?: string[];
} & Partial<TMetadata>;

export interface SchemaMetadata {
  /**
   * A name for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable name or description for the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  name?: string;

  /**
   * A title for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable name or description for the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  title?: string;

  /**
   * A description for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable explanation or summary of the schema's purpose and usage. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  description?: string;

  /**
   * A default value for the schema, which can be used by validation libraries or other tools that support this feature. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  default?: unknown;

  /**
   * An array of example values that conform to the schema. This property can be used to provide sample data for documentation purposes or to assist developers in understanding the expected structure and content of the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  examples?: unknown[];

  /**
   * An array of strings indicating groups that the schema belongs to. This property can be used for organizational or categorization purposes in documentation tools or other libraries that support this feature. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  groups?: string[];

  /**
   * A visibility level for the schema, which can be used by documentation tools or other libraries that support this feature to determine how the schema should be presented or accessed. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  visibility?: "public" | "protected" | "private";

  /**
   * A resource identifier for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable name or description for the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  resourceId?: string;

  /**
   * An indicator specifying if the field should be marked as hidden or not.
   */
  isHidden?: boolean;

  /**
   * An indicator specifying if the field should be ignored or not.
   */
  isIgnored?: boolean;

  /**
   * An indicator specifying if the field is internal or not.
   *
   * @internal
   */
  isInternal?: boolean;

  /**
   * An indicator specifying if the field should only be populated at runtime or not.
   */
  isRuntime?: boolean;

  /**
   * An indicator specifying if the field is read-only or not.
   */
  isReadonly?: boolean;

  /**
   * An indicator specifying if the field is a primary key or not.
   */
  isPrimaryKey?: boolean;

  /**
   * An array of strings or an alias reference to indicate that the field is an alias for one or more other fields.
   */
  alias?: string[];

  /**
   * Schemas that are unioned together to form a single schema.
   */
  union?: JsonSchemaLike[];

  /**
   * Whether the property is optional on its parent object.
   */
  isOptional?: boolean;

  [key: string]: unknown | undefined;
}

/** @deprecated Use {@link JsonSchemaType} instead. */
export type JTDNumberType =
  | "float32"
  | "float64"
  | "int8"
  | "uint8"
  | "int16"
  | "uint16"
  | "int32"
  | "uint32";

/** @deprecated Use {@link JsonSchemaPrimitiveType} instead. */
export type JTDStringType = "string" | "timestamp";

/** @deprecated Use {@link JsonSchemaPrimitiveType} instead. */
export type JTDType = JTDNumberType | JTDStringType | "boolean";

/** @deprecated Use {@link JsonSchemaObjectType} instead. */
export type JTDSchemaObjectType<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> = JsonSchemaObjectType<TMetadata>;

/** @deprecated Use {@link JsonSchemaType} instead. */
export type JTDSchemaType<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> = JsonSchemaType & Partial<TMetadata>;

export type SchemaSourceVariant =
  | "standard-schema"
  | "jtd-schema"
  | "json-schema"
  | "zod3"
  | "untyped"
  | "reflection";

export type SchemaInputVariant = SchemaSourceVariant | "type-definition";

export type SchemaSourceInput<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> =
  | StandardJSONSchemaV1
  | JsonSchemaType
  | z3.ZodTypeAny
  | UntypedInputObject
  | UntypedSchema
  | Type
  | JTDSchemaType<TMetadata>;

export type TypeDefinitionReference = TypeDefinition | string;

export type SchemaInput = SchemaSourceInput | Schema | TypeDefinitionReference;

/**
 * A schema extracted from a source input, normalised to JSON Schema.
 */
export interface Schema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> {
  hash: string;
  variant: SchemaInputVariant;
  schema: JsonSchemaType & Partial<TMetadata>;
}

/**
 * A JSON Schema object form (has `type: "object"` and `properties`).
 */
export interface ObjectSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> extends Schema<TMetadata> {
  schema: JsonSchemaObjectType<TMetadata>;
}

export interface BaseSchemaSource {
  hash: string;
  variant: SchemaSourceVariant;
  schema: SchemaSourceInput;
}

export interface JTDSchemaSchemaSource<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> extends BaseSchemaSource {
  variant: "jtd-schema";
  schema: JTDSchemaType<TMetadata>;
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
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> extends Schema<TMetadata> {
  source: SchemaSource;
}
