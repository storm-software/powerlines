/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { Options as PowerPlantPrismaOptions } from "@power-plant/prisma";
import type { PrismaSchema } from "@power-plant/prisma-schema";
import type {
  PowerPlantPluginContext,
  PowerPlantPluginResolvedConfig
} from "@powerlines/plugin-power-plant/types/plugin";
import type {
  PulumiPluginContext,
  PulumiPluginOptions,
  PulumiPluginResolvedConfig,
  PulumiPluginUserConfig
} from "@powerlines/plugin-pulumi";
import type { ResolvedConfig, UserConfig } from "powerlines";

export type { Options as PowerPlantPrismaOptions } from "@power-plant/prisma";
export type { PrismaSchema } from "@power-plant/prisma-schema";

export interface PrismaPostgresPrismaPluginOptions {
  /**
   * The Prisma project name
   *
   * @defaultValue "\{name\}"
   */
  projectId?: string;

  /**
   * The region to deploy the database to
   *
   * @defaultValue "us-east-1"
   */
  region?:
    | "us-east-1"
    | "us-east-2"
    | "us-west-1"
    | "us-west-2"
    | "af-south-1"
    | "ap-east-1"
    | "ap-south-1"
    | "ap-south-2"
    | "ap-southeast-1"
    | "ap-southeast-2"
    | "ap-southeast-3"
    | "ap-southeast-4"
    | "ap-northeast-1"
    | "ap-northeast-2"
    | "ap-northeast-3"
    | "ca-central-1"
    | "ca-west-1"
    | "eu-central-1"
    | "eu-central-2"
    | "eu-west-1"
    | "eu-west-2"
    | "eu-west-3"
    | "eu-north-1"
    | "eu-south-1"
    | "eu-south-2"
    | "il-central-1"
    | "me-south-1"
    | "me-central-1"
    | "sa-east-1";

  /**
   * The database name
   *
   * @defaultValue "\{region\}.\{mode\}.\{name\}"
   */
  databaseName?: string;
}

/**
 * Options for the Prisma Powerlines plugin.
 */
export type PrismaPluginOptions = Partial<
  Omit<PowerPlantPrismaOptions, "schemaPath">
> & {
  /**
   * Path to the Prisma schema file (or directory) used by `@power-plant/prisma`.
   *
   * @remarks
   * Maps to the Power Plant generator `schemaPath` option. This field allows
   * the use of the "\{projectRoot\}" token to refer to the project's root
   * directory - the value will be replaced with the correct file path by the
   * plugin.
   *
   * @defaultValue "\{projectRoot\}/prisma"
   */
  schema?: string;

  /**
   * The service token to use for the Prisma API
   */
  serviceToken?: string;

  /**
   * Configuration parameters to manage a Prisma Postgres database
   */
  prismaPostgres?: PrismaPostgresPrismaPluginOptions | true;

  /**
   * The configuration options for Pulumi.
   */
  pulumi?: PulumiPluginOptions;
};

export type PrismaPluginUserConfig = UserConfig &
  PulumiPluginUserConfig & {
    prisma?: PrismaPluginOptions;
  };

export type PrismaPluginResolvedConfig = ResolvedConfig &
  PulumiPluginResolvedConfig &
  PowerPlantPluginResolvedConfig<PrismaSchema, PowerPlantPrismaOptions> & {
    prisma: Omit<
      PrismaPluginOptions,
      "schema" | "prismaPostgres"
    > & {
      /**
       * Path to the Prisma schema file (or directory).
       */
      schema: string;

      /**
       * Configuration parameters to manage a Prisma Postgres database
       */
      prismaPostgres?: Required<PrismaPostgresPrismaPluginOptions>;
    };
  };

export type PrismaPluginContext<
  TResolvedConfig extends PrismaPluginResolvedConfig =
    PrismaPluginResolvedConfig
> = PowerPlantPluginContext<
  PrismaSchema,
  PowerPlantPrismaOptions,
  TResolvedConfig
> &
  PulumiPluginContext;
