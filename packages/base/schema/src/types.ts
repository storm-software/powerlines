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
import type { TypeDefinitionParameter } from "@stryke/types/configuration";
import * as z3 from "zod/v3";

export type SchemaDefinitionSourceVariant =
  | "json-schema"
  | "standard-schema"
  | "zod3"
  | "reflection";

export type SchemaDefinitionInputVariant =
  | SchemaDefinitionSourceVariant
  | "type-definition";

export type SchemaDefinitionSourceInput =
  | JsonSchemaType
  | StandardJSONSchemaV1
  | z3.ZodTypeAny
  | Type;

export type SchemaDefinitionInput =
  | SchemaDefinitionSourceInput
  | SchemaDefinition
  | TypeDefinitionParameter;

export interface SchemaDefinition<
  TSchema extends JsonSchemaType = JsonSchemaType
> {
  hash: string;
  variant: SchemaDefinitionInputVariant;
  schema: TSchema;
}

export interface SchemaDefinitionSourceBase {
  hash: string;
  variant: SchemaDefinitionSourceVariant;
  schema: SchemaDefinitionSourceInput;
}

export interface SchemaDefinitionJsonSchemaSource extends SchemaDefinitionSourceBase {
  variant: "json-schema";
  schema: JsonSchemaType;
}

export interface SchemaDefinitionStandardSchemaSource extends SchemaDefinitionSourceBase {
  variant: "standard-schema";
  schema: StandardJSONSchemaV1;
}

export interface SchemaDefinitionZod3Source extends SchemaDefinitionSourceBase {
  variant: "zod3";
  schema: z3.ZodTypeAny;
}

export interface SchemaDefinitionReflectionSource extends SchemaDefinitionSourceBase {
  variant: "reflection";
  schema: Type;
}

export type SchemaDefinitionSource =
  | SchemaDefinitionJsonSchemaSource
  | SchemaDefinitionStandardSchemaSource
  | SchemaDefinitionZod3Source
  | SchemaDefinitionReflectionSource;

export interface ExtractedSchemaDefinition<
  TSchema extends JsonSchemaType = JsonSchemaType
> extends SchemaDefinition<TSchema> {
  source: SchemaDefinitionSource;
}
