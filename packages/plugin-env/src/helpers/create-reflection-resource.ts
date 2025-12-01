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

import { computed, createResource } from "@alloy-js/core";
import {
  ReflectionClass,
  ReflectionKind
} from "@powerlines/deepkit/vendor/type";
import { titleCase } from "@stryke/string-format/title-case";
import { EnvPluginContext } from "../types/plugin";
import { loadEnvFromContext } from "./load";
import { readEnvTypeReflection } from "./persistence";

/**
 * Creates a reflection resource for the environment configuration.
 *
 * @param context - The environment plugin context.
 * @returns A resource that provides the reflection of the environment configuration.
 */
export function createReflectionResource(context?: EnvPluginContext) {
  const defaultValue = computed(
    () => context && loadEnvFromContext(context, process.env)
  );

  return createResource<ReflectionClass<Record<string, any>>>(async () => {
    if (!context) {
      return new ReflectionClass({
        kind: ReflectionKind.objectLiteral,
        description: `The initial environment configuration state for the Powerlines project.`,
        types: []
      });
    }

    const result = await readEnvTypeReflection(context, "env");
    result.getProperties().forEach(prop => {
      const aliases = prop.getAlias();
      aliases.filter(Boolean).forEach(alias => {
        result.addProperty({
          name: alias,
          optional: prop.isOptional() ? true : undefined,
          readonly: prop.isReadonly() ? true : undefined,
          description: prop.getDescription(),
          visibility: prop.getVisibility(),
          type: prop.getType(),
          default: prop.getDefaultValue(),
          tags: {
            hidden: prop.isHidden(),
            ignore: prop.isIgnored(),
            internal: prop.isInternal(),
            alias: prop
              .getAlias()
              .filter(a => a !== alias)
              .concat(prop.name),
            title: prop.getTitle() || titleCase(prop.name),
            readonly: prop.isReadonly(),
            permission: prop.getPermission(),
            domain: prop.getDomain()
          }
        });
      });
    });

    result.getProperties().forEach(prop => {
      prop.setDefaultValue(
        (defaultValue.value as Record<string, any>)?.[prop.getNameAsString()] ??
          prop
            .getAlias()
            .reduce(
              (ret, alias) =>
                ret ?? (defaultValue.value as Record<string, any>)?.[alias],
              undefined
            ) ??
          prop.getDefaultValue()
      );
    });

    return result;
  });
}
