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

import { NodePath } from "@babel/core";
import * as t from "@babel/types";
import { createBabelPlugin } from "@powerlines/plugin-babel/helpers/create-plugin";
import { addImport } from "@powerlines/plugin-babel/helpers/module-helpers";
import { BabelPluginPass } from "@powerlines/plugin-babel/types/config";
import { getProperties, stringifyValue } from "@powerlines/schema";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import { EnvPluginContext, EnvSchemaMetadata } from "../types/plugin";

/*
 * The Powerlines - Environment Configuration Babel Plugin
 *
 * @param babel - The Babel core module
 * @returns The Babel plugin object
 */
export const envBabelPlugin = createBabelPlugin<EnvPluginContext>(
  "env",
  ({ logger, context }) => {
    const vars = getProperties(context.env.vars);
    function extractEnv(
      node: t.Identifier,
      pass: BabelPluginPass,
      isInjectable = false
    ) {
      if (node.name) {
        const name = node.name.replace(
          new RegExp(`^(${context.config.env.prefix.join("|")})_`),
          ""
        );

        logger.trace({
          meta: {
            category: "env"
          },
          message: `Environment variable ${name} found in ${
            pass.filename || "unknown file"
          }.`
        });

        if (
          name in vars &&
          isSetObject(vars[name]) &&
          !vars[name]?.metadata?.isIgnored
        ) {
          vars[name].metadata ??= {} as EnvSchemaMetadata;

          logger.debug({
            meta: {
              category: "env"
            },
            message: `The "${name}" environment variable is used in the source code file "${
              pass.filename || "unknown file"
            }" and will be added to the environment schema's active variables list.`
          });

          vars[name].metadata.active ??= [];
          vars[name].metadata.active.push(name);
          if (
            !vars[name].metadata.isRuntime &&
            ((context.config.env.inject && isInjectable) ||
              context.config.env.validate)
          ) {
            if (
              context.config.env.validate &&
              !vars[name].optional &&
              isUndefined(vars[name].metadata.default)
            ) {
              throw new Error(
                `Environment variable \`${
                  name
                }\` is missing a default value, but is active in the source code${
                  pass.filename ? ` file \`${pass.filename}\`` : ""
                }.\n\nPlease add a default value to the schema, or if this variable is optional, please mark it as optional in the type definition.`
              );
            }

            return stringifyValue(vars[name].metadata.default);
          }
        } else if (context.config.env.validate) {
          throw new Error(
            `Environment variable \`${name}\` is active in the source code${
              pass.filename ? ` file \`${pass.filename}\`` : ""
            }, but is not defined in the \`vars\` schema. Please check the \`env.vars\` configuration option. If you are using a custom env schema, please make sure that the configuration variable names match the ones used in the source code.`
          );
        } else {
          logger.warn({
            meta: {
              category: "env"
            },
            message: `Environment variable \`${name}\` is active in the source code${
              pass.filename ? ` file \`${pass.filename}\`` : ""
            }, but is not defined in the \`vars\` schema. If this is intentional, you can ignore this warning. Otherwise, please check the \`env.vars\` configuration option. If you are using a custom env schema, please make sure that the configuration variable names match the ones used in the source code.`
          });
        }
      }

      return undefined;
    }

    return {
      visitor: {
        MemberExpression(
          path: NodePath<t.MemberExpression>,
          pass: BabelPluginPass
        ) {
          if (
            path
              .get("object")
              ?.get("property")
              ?.isIdentifier({ name: "env" }) &&
            path
              .get("object")
              ?.get("object")
              ?.isIdentifier({ name: "process" }) &&
            path.get("property")?.isIdentifier()
          ) {
            // process.env.CONFIG_NAME

            const identifier = path.get("property")?.node as t.Identifier;
            if (!identifier.name) {
              return;
            }

            extractEnv(identifier, pass, false);

            path.replaceWithSourceString(`env.${identifier.name}`);
            addImport(path, {
              module: `${context.config.framework?.name || "powerlines"}:env`,
              name: "env",
              imported: "env"
            });
          } else if (
            path
              .get("object")
              ?.get("property")
              ?.isIdentifier({ name: "env" }) &&
            path.get("object")?.get("object")?.isMetaProperty() &&
            path.get("property")?.isIdentifier()
          ) {
            // import.meta.env.CONFIG_NAME

            const identifier = path.get("property")?.node as t.Identifier;
            if (!identifier.name) {
              return;
            }

            extractEnv(identifier, pass, false);

            path.replaceWithSourceString(`env.${identifier.name}`);
            addImport(path, {
              module: `${context.config.framework?.name || "powerlines"}:env`,
              name: "env",
              imported: "env"
            });
          } else if (
            path.get("object")?.isIdentifier({ name: "env" }) &&
            path.get("property")?.isIdentifier()
          ) {
            // env.CONFIG_NAME

            const identifier = path.get("property")?.node as t.Identifier;
            if (!identifier.name) {
              return;
            }

            extractEnv(identifier, pass, false);
          }
        }
      }
    };
  }
);
