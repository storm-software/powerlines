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

declare module "@prisma/migrate" {
  import { SqlQueryOutput } from "@prisma/generator";
  import { PrismaConfigWithDatasource, SchemaContext } from "@prisma/internals";

  export interface IntrospectSqlInput {
    fileName: string;
    name: string;
    source: string;
  }

  export interface IntrospectSqlError {
    fileName: string;
    message: string;
  }

  export type IntrospectSqlResult =
    | {
        ok: true;
        queries: SqlQueryOutput[];
      }
    | {
        ok: false;
        errors: IntrospectSqlError[];
      };

  export function introspectSql(
    schemaContext: SchemaContext,
    config: PrismaConfigWithDatasource,
    baseDir: string,
    queries: IntrospectSqlInput[]
  ): Promise<IntrospectSqlResult>;
}
