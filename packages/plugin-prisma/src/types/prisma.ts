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

export type MultipleSchemas = Array<[filename: string, content: string]>;
export type SchemaFileInput = string | [filename: string, content: string];

export type ConnectorType =
  | "mysql"
  | "mongodb"
  | "sqlite"
  | "postgresql"
  | "postgres" // TODO: we could normalize postgres to postgresql this in engines to reduce the complexity?
  | "prisma+postgres" // Note: used for Prisma Postgres, managed by PDP
  | "sqlserver"
  | "cockroachdb";

export type ActiveConnectorType = Exclude<
  ConnectorType,
  "postgres" | "prisma+postgres"
>;

export interface EnvValue {
  fromEnvVar: null | string;
  value: null | string;
}

export interface DataSource {
  name: string;
  provider: ConnectorType;
  // In Rust, this comes from `Connector::provider_name()`
  activeProvider: ActiveConnectorType;
  url: EnvValue;
  directUrl?: EnvValue;
  schemas: string[] | [];
  sourceFilePath: string;
}

export interface GetSchemaResponse {
  config: PrismaSchema;
  errors: GetSchemaValidationError[];
}

export interface EnvValue {
  fromEnvVar: null | string;
  value: null | string;
}

export interface EnvPaths {
  rootEnvPath: string | null;
  schemaEnvPath: string | undefined;
}

export interface BinaryTargetsEnvValue {
  fromEnvVar: string | null;
  value: string;
  native?: boolean;
}

export interface GeneratorConfig {
  name: string;
  output: EnvValue | null;
  isCustomOutput?: boolean;
  provider: EnvValue;
  config: {
    /** `output` is a reserved name and will only be available directly at `generator.output` */
    output?: never;
    /** `provider` is a reserved name and will only be available directly at `generator.provider` */
    provider?: never;
    /** `binaryTargets` is a reserved name and will only be available directly at `generator.binaryTargets` */
    binaryTargets?: never;
    /** `previewFeatures` is a reserved name and will only be available directly at `generator.previewFeatures` */
    previewFeatures?: never;
  } & {
    [key: string]: string | string[] | undefined;
  };
  binaryTargets: BinaryTargetsEnvValue[];
  previewFeatures: string[];
  envPaths?: EnvPaths;
  sourceFilePath: string;
}

export interface PrismaSchema {
  datasources: DataSource[];
  generators: GeneratorConfig[];
  warnings: string[];
}

interface GetSchemaValidationError {
  fileName: string | null;
  message: string;
}

export interface GetSchemaOptions {
  datamodel: SchemaFileInput;
  ignoreEnvVarErrors?: boolean;
}
