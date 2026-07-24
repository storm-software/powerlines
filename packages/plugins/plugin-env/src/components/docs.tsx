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

import { code } from "@alloy-js/core";
import { Spacing } from "@power-plant/alloy-js/core/components/spacing";
import { Heading } from "@power-plant/alloy-js/markdown/components/heading";
import {
  MarkdownFile,
  MarkdownFileProps
} from "@power-plant/alloy-js/markdown/components/markdown-file";
import { MarkdownTable } from "@power-plant/alloy-js/markdown/components/markdown-table";
import { getPropertiesList } from "@power-plant/schema";
import { stringifyType } from "@power-plant/schema/codegen";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { joinPaths } from "@stryke/path/join";
import { getDocsOutputPath } from "powerlines/plugin-utils";
import { EnvPluginContext } from "../types/plugin";

export interface EnvDocsFileProps extends Partial<MarkdownFileProps> {
  /**
   * The heading level offset to apply to the generated documentation.
   *
   * @remarks
   * This is useful when nesting the documentation within other markdown files.
   *
   * @defaultValue 0
   */
  levelOffset?: number;
}

/**
 * Generates the environment configuration markdown documentation for the Powerlines project.
 */
export function EnvDocsFile(props: EnvDocsFileProps) {
  const { levelOffset = 0, ...rest } = props;

  const context = usePowerlines<EnvPluginContext>();

  return (
    <MarkdownFile
      path={joinPaths(getDocsOutputPath(context.config.root), "env.md")}
      {...rest}>
      <Heading level={1 + levelOffset}>Environment</Heading>
      {code`The ${
        context.config.name
      } package uses various configuration parameters to control the behavior of the application. These parameters can be provided as environment variables when the application is run, or they can be defined in a \`config.json\` file in the application configuration directory.`}
      <Spacing />
      <Heading level={2 + levelOffset}>Configuration</Heading>
      <Spacing />
      {code`The below list of configuration parameters are **not** considered sensitive or confidential. Any values provided in these variables will be available in plain text locally.`}
      <Spacing />
      <MarkdownTable
        data={
          getPropertiesList(context.env.config)
            .filter(
              property =>
                getPropertiesList(context.env.config).some(
                  p =>
                    p.name === property.name &&
                    context.env.config.active.includes(property.name)
                ) &&
                !property?.hidden &&
                !property?.ignore &&
                !property?.readOnly &&
                !property?.internal
            )
            .sort((a, b) =>
              !a?.name && !b?.name
                ? 0
                : !a?.name
                  ? 1
                  : !b?.name
                    ? -1
                    : a.name.localeCompare(b.name)
            )
            .map(property => {
              return {
                name: property.name?.trim(),
                description: (property.description ?? "").trim(),
                type: stringifyType(property)
                  .trim()
                  .replaceAll(/\s*(?:\||&)\s*/g, ", or "),
                defaultValue: property.default
                  ? stringifyType(property.default)
                  : "",
                required: property.required ? "" : "✔"
              };
            }) ?? []
        }
      />
    </MarkdownFile>
  );
}
