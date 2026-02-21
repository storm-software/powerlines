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
import { stringifyDefaultValue } from "@powerlines/deepkit/utilities";

import { createBabelPlugin } from "@powerlines/plugin-babel/helpers/create-plugin";
import { addImport } from "@powerlines/plugin-babel/helpers/module-helpers";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { BabelPluginPass } from "powerlines/types/babel";
import { EnvPluginContext } from "../types/plugin";

/*
 * The Powerlines - Environment Configuration Babel Plugin
 *
 * @param babel - The Babel core module
 * @returns The Babel plugin object
 */
export const envBabelPlugin = createBabelPlugin<EnvPluginContext>(
  "env",
  ({ log, context }) => {
    function extractEnv(
      node: t.Identifier,
      pass: BabelPluginPass,
      isInjectable = false
    ) {
      const envTypesAliasProperties = context.env.types.env
        ?.getProperties()
        .filter(prop => prop.getAlias().length > 0);

      if (node.name) {
        const prefix = context.config.env.prefix.find(
          pre =>
            node.name &&
            node.name.startsWith(pre) &&
            (context.env.types.env?.hasProperty(
              node.name.replace(`${pre}_`, "")
            ) ||
              envTypesAliasProperties.some(prop =>
                prop.getAlias().includes(node.name.replace(`${pre}_`, ""))
              ))
        );

        let name = node.name;
        if (prefix) {
          name = node.name.replace(`${prefix}_`, "");
        }

        log(
          LogLevelLabel.TRACE,
          `Environment variable ${name} found in ${
            pass.filename || "unknown file"
          }.`
        );

        if (
          context.env.types.env?.hasProperty(name) ||
          envTypesAliasProperties.some(prop => prop.getAlias().includes(name))
        ) {
          const envProperty = context.env.types.env.hasProperty(name)
            ? context.env.types.env.getProperty(name)
            : envTypesAliasProperties.find(prop =>
                prop.getAlias().includes(name)
              );
          if (!envProperty || envProperty.isIgnored()) {
            return;
          }

          if (!context.env.used.env.hasProperty(name)) {
            log(
              LogLevelLabel.DEBUG,
              `Adding "${name}" environment variables found in "${
                pass.filename || "unknown file"
              }" to used environment configuration reflection object.`
            );

            context.env.used.env.addProperty(envProperty.property);
          }

          if (context.config.env.inject && isInjectable) {
            let value = context.env.parsed?.[name];
            if (value === undefined) {
              const prefix = context.config.env.prefix.find(pre => {
                return context.env.parsed[`${pre.replace(/_$/g, "")}_${name}`];
              });
              if (prefix) {
                value =
                  context.env.parsed[`${prefix.replace(/_$/g, "")}_${name}`];
              }
            }

            value ??= envProperty.getDefaultValue();

            if (envProperty.isValueRequired() && value === undefined) {
              throw new Error(
                `Environment variable \`${name}\` is not defined in the .env configuration files`
              );
            }

            return stringifyDefaultValue(envProperty, value);
          }
        } else if (context.config.env.validate) {
          throw new Error(
            `The "${name}" environment variable is not defined in the \`env\` type definition, but is used in the source code file ${
              pass.filename ? pass.filename : "unknown"
            }.

          The following environment configuration names are defined in the \`env\` type definition: \n${context.env.types.env
            ?.getPropertyNames()
            .sort((a, b) => String(a).localeCompare(String(b)))
            .map(
              typeDef =>
                ` - ${String(typeDef)} ${
                  envTypesAliasProperties.some(
                    prop =>
                      prop.getNameAsString() === String(typeDef) &&
                      prop.getAlias().length > 0
                  )
                    ? `(Alias: ${envTypesAliasProperties
                        ?.find(
                          prop => prop.getNameAsString() === String(typeDef)
                        )
                        ?.getAlias()
                        .join(", ")})`
                    : ""
                }`
            )
            .join(
              "\n"
            )} \n\nUsing the following env prefix: \n${context.config.env.prefix
            .map(prefix => ` - ${prefix}`)
            .join(
              "\n"
            )} \n\nPlease check your \`env\` configuration option. If you are using a custom dotenv type definition, please make sure that the configuration names match the ones in the code. \n\n`
          );
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
              module: `${context.config.framework || "powerlines"}:env`,
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
              module: `${context.config.framework || "powerlines"}:env`,
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
