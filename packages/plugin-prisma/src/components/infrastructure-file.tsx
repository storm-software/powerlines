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

import { code, Show, splitProps } from "@alloy-js/core";
import { VarDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  InfrastructureFile,
  InfrastructureFileProps
} from "@powerlines/plugin-alloy/typescript/components/infrastructure-file";
import { kebabCase } from "@stryke/string-format/kebab-case";
import defu from "defu";
import { PrismaPluginContext } from "../types";

export type PrismaPostgresInfrastructureFileProps = Omit<
  InfrastructureFileProps,
  "id"
>;

/**
 * Generates the Prisma Postgres infrastructure configuration module for the Powerlines project.
 */
export function PrismaPostgresInfrastructureFile(
  props: PrismaPostgresInfrastructureFileProps
) {
  const [{ children, imports }, rest] = splitProps(props, [
    "children",
    "imports"
  ]);

  const context = usePowerlines<PrismaPluginContext>();

  return (
    <InfrastructureFile
      id="prisma-postgres"
      {...rest}
      imports={defu(
        {
          "@pulumi/pulumi": "pulumi",
          "@pulumi/prisma-postgres": "prismaPostgres"
        },
        imports ?? {}
      )}>
      <VarDeclaration
        export
        const
        name="project"
        initializer={code`new prismaPostgres.Project("project", {
          name: "${context.config.prisma.prismaPostgres?.projectId}",
        }); `}
      />
      <Spacing />
      <VarDeclaration
        export
        const
        name="database"
        initializer={code`prismaPostgres.Database("database", {
          projectId: project.id,
          name: "${
            context.config.prisma.prismaPostgres?.databaseName ||
            `${kebabCase(context.config.name)}.${
              context.config.mode
            }.${context.config.prisma.prismaPostgres?.region}`
          }",
          region: "${context.config.prisma.prismaPostgres?.region}",
        }); `}
      />
      <Spacing />
      <VarDeclaration
        export
        const
        name="connection"
        initializer={code`new prismaPostgres.Connection("connection", {
          databaseId: database.id,
          name: "${kebabCase(context.config.name)}-api-key",
        }); `}
      />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </InfrastructureFile>
  );
}
