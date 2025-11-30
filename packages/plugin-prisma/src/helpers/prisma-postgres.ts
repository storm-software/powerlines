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

import { PrismaPluginContext } from "../types/plugin";

/**
 * Find a Postgres database by name.
 *
 * @param context - The Prisma plugin context.
 * @param name - The name of the database to find.
 * @returns The database object if found, otherwise undefined.
 */
export async function findDatabaseByName(
  context: PrismaPluginContext,
  name: string
) {
  if (!context.config.prisma.prismaPostgres?.projectId) {
    throw new Error(
      `Prisma Postgres project ID is not configured. Please set "prisma.prismaPostgres.projectId" in your Powerlines configuration.`
    );
  }

  const databases = await context.prisma.api.listDatabases({
    path: {
      projectId: context.config.prisma.prismaPostgres.projectId
    }
  });

  return databases.data.data.find(db => db.name === name);
}
