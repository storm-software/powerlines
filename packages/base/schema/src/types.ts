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
import type { JsonSchemaType } from "@stryke/json";
import type { TypeDefinition } from "@stryke/types/configuration";
import * as z3 from "zod/v3";

export type SchemaSourceVariant =
  | "json-schema"
  | "standard-schema"
  | "zod3"
  | "reflection";

export type SchemaInputVariant = SchemaSourceVariant | "type-definition";

export type SchemaSourceInput =
  | JsonSchemaType
  | StandardJSONSchemaV1
  | z3.ZodTypeAny
  | Type;

export type TypeDefinitionReference = TypeDefinition | string;

export type SchemaInput = SchemaSourceInput | Schema | TypeDefinitionReference;

export interface Schema<TSchema extends JsonSchemaType = JsonSchemaType> {
  hash: string;
  variant: SchemaInputVariant;
  schema: TSchema;
}

export interface BaseSchemaSource {
  hash: string;
  variant: SchemaSourceVariant;
  schema: SchemaSourceInput;
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

export type SchemaSource =
  | JsonSchemaSchemaSource
  | StandardSchemaSchemaSource
  | Zod3SchemaSource
  | ReflectionSchemaSource;

export interface ExtractedSchema<
  TSchema extends JsonSchemaType = JsonSchemaType
> extends Schema<TSchema> {
  source: SchemaSource;
}
