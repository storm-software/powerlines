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
import type { TypeDefinition } from "@stryke/types/configuration";
import { JSONSchemaType } from "ajv";
import { SomeJSONSchema } from "ajv/dist/types/json-schema";
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
   * An indicator specifying if the field is optional or not. This property can be used by documentation tools or other libraries that support this feature to determine whether the field is required or optional when generating documentation or performing other operations. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  optional?: boolean;

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
}

export type SchemaProperty<
  TParent extends Record<string, any> = Record<string, any>,
  TName extends string = string
> = JsonSchema<TParent[TName]> & {
  name: TName;
  optional: boolean;
  nullable: boolean;
};

/**
 * A JSON Schema type that includes additional Powerlines-specific metadata properties. This type extends the standard JSON Schema definition with optional properties such as `name`, `title`, `description`, `default`, `examples`, `groups`, `visibility`, and various flags for controlling how the schema is treated by documentation tools or other libraries that support these features. The presence of these metadata properties does not affect the validation behavior of the schema itself, but they can provide additional context or information about the schema when used in conjunction with compatible tools.
 */
export type JsonSchema<T = unknown> = JSONSchemaType<T> & SchemaMetadata;

/**
 * A JSON Schema type that is compatible with all the JSON schema variants, and includes additional Powerlines-specific metadata properties. This type is designed to be flexible and accommodate various schema shapes while still providing the ability to include metadata for documentation or other purposes. The presence of the metadata properties does not affect the validation behavior of the schema itself, but they can provide additional context or information about the schema when used in conjunction with compatible tools.
 */
export type JsonSchemaLike = SomeJSONSchema & SchemaMetadata;

/**
 * A JSON Schema object type that includes a `type` property set to "object", a `properties` object defining the properties of the schema, and optional metadata properties. This type is used to represent JSON Schema definitions for objects, and it extends the standard JSON Schema definition with additional Powerlines-specific metadata properties. The presence of these metadata properties does not affect the validation behavior of the schema itself, but they can provide additional context or information about the schema when used in conjunction with compatible tools.
 */
export type JsonSchemaObject<
  T extends Record<string, any> = Record<string, any>
> = Omit<SomeJSONSchema, "type" | "properties" | "required"> & {
  type: "object";
  properties: Record<string, JsonSchema<T[string]>>;
  required?: string[];
} & SchemaMetadata;

export type SchemaSourceVariant =
  | "standard-schema"
  | "json-schema"
  | "zod3"
  | "untyped"
  | "reflection";

export type SchemaInputVariant = SchemaSourceVariant | "type-definition";

export type SchemaSourceInput<T = unknown> =
  | StandardJSONSchemaV1
  | JsonSchema<T>
  | z3.ZodTypeAny
  | UntypedInputObject
  | UntypedSchema
  | Type;

export type TypeDefinitionReference = TypeDefinition | string;

export type SchemaInput<T = unknown> =
  | SchemaSourceInput<T>
  | Schema<T>
  | TypeDefinitionReference;

/**
 * A schema extracted from a source input, normalized to JSON Schema.
 */
export interface Schema<T = unknown> {
  hash: string;
  variant: SchemaInputVariant;
  schema: JsonSchema<T>;
}

export interface BaseSchemaSource {
  hash: string;
  variant: SchemaSourceVariant;
  schema: SchemaSourceInput;
}

export interface JsonSchemaSchemaSource<
  TMetadata extends SchemaMetadata = SchemaMetadata
> extends BaseSchemaSource {
  variant: "json-schema";
  schema: JsonSchema<TMetadata>;
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
  | StandardSchemaSchemaSource
  | Zod3SchemaSource
  | UntypedSchemaSource
  | ReflectionSchemaSource;

export interface ExtractedSchema<T = unknown> extends Schema<T> {
  source: SchemaSource;
}
