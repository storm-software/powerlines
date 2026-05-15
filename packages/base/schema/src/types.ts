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
 * The set of numeric `type` strings supported by JSON Type Definition (RFC 8927).
 */
export type JTDNumberType =
  | "float32"
  | "float64"
  | "int8"
  | "uint8"
  | "int16"
  | "uint16"
  | "int32"
  | "uint32";

/**
 * The set of string `type` strings supported by JSON Type Definition (RFC 8927).
 */
export type JTDStringType = "string" | "timestamp";

/**
 * The set of `type` strings supported by JSON Type Definition (RFC 8927).
 */
export type JTDType = JTDNumberType | JTDStringType | "boolean";

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

export interface SchemaMetadata {
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
   * A table name for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable name or description for the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  table?: string;

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
   * An indicator specifying if the field is read-only or not. This property can be used to indicate that a field should not be modified after it has been set, which can be useful for documentation purposes or to assist developers in understanding the expected behavior of the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  isReadonly?: boolean;

  /**
   * An indicator specifying if the field is a primary key or not. This property can be used to indicate that a field serves as a unique identifier for records in a dataset, which can be useful for documentation purposes or to assist developers in understanding the expected structure and behavior of the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  isPrimaryKey?: boolean;

  /**
   * An array of strings or an alias reference to indicate that the field is an alias for one or more other fields. This property can be used to provide alternative names or references for a field, which can be useful for documentation purposes or to assist developers in understanding the expected structure and content of the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  alias?: string[];

  /**
   * Schemas that are unioned together to form a single schema. This property can be used to represent complex data structures that can conform to multiple different schemas. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  union?: JsonSchemaLike[];

  [key: string]: unknown | undefined;
}

export type JTDSchemaType<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> = (
  | {
      ref: string;
    }
  | {
      type: JTDType;
    }
  | {
      enum: string[];
    }
  | {
      elements: JTDSchemaType<TMetadata>;
    }
  | {
      values: JTDSchemaType<TMetadata>;
    }
  | {
      properties: Record<string, JTDSchemaType<TMetadata>>;
      optionalProperties?: Record<string, JTDSchemaType<TMetadata>>;
      additionalProperties?: boolean;
    }
  | {
      properties?: Record<string, JTDSchemaType<TMetadata>>;
      optionalProperties: Record<string, JTDSchemaType<TMetadata>>;
      additionalProperties?: boolean;
    }
  | {
      discriminator: string;
      mapping: Record<string, JTDSchemaType<TMetadata>>;
    }
  // eslint-disable-next-line ts/no-empty-object-type
  | {}
) & {
  nullable?: boolean;
  metadata?: TMetadata;
  definitions?: Record<string, JTDSchemaType<TMetadata>>;
};

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
  | JTDSchemaType<TMetadata>
  | JsonSchemaType
  | z3.ZodTypeAny
  | UntypedInputObject
  | UntypedSchema
  | Type;

export type TypeDefinitionReference = TypeDefinition | string;

export type SchemaInput = SchemaSourceInput | Schema | TypeDefinitionReference;

export interface Schema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> {
  hash: string;
  variant: SchemaInputVariant;
  schema: JTDSchemaType<TMetadata>;
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
