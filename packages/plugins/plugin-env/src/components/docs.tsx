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

import { code, Show } from "@alloy-js/core";
import { Link } from "@alloy-js/markdown";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { Heading } from "@powerlines/plugin-alloy/markdown/components/heading";
import {
  MarkdownFile,
  MarkdownFileProps
} from "@powerlines/plugin-alloy/markdown/components/markdown-file";
import { MarkdownTable } from "@powerlines/plugin-alloy/markdown/components/markdown-table";
import { JsonSchema } from "@powerlines/schema";
import { stringifyType } from "@powerlines/schema/codegen";
import { getPropertiesList } from "@powerlines/schema/helpers";
import { joinPaths } from "@stryke/path/join";
import { getDocsOutputPath } from "powerlines/plugin-utils";
import { Env, EnvPluginContext } from "../types/plugin";

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
      <Heading level={1 + levelOffset}>Environment Configuration</Heading>
      {code`Below is a list of environment configuration parameters used by the`}
      <Show when={!!context.packageJson.name}>
        <Link
          href={`https://www.npmjs.com/package/${context.packageJson.name}`}
          title={context.packageJson.name!}
        />
      </Show>
      {code`package. These values can be updated in the \`.env\` file in the root of the project.`}
      <Spacing />
      <Heading level={2 + levelOffset}>Variables</Heading>
      <Spacing />
      {code`The below list of environment variables are used as configuration parameters to drive the processing of the application. The data contained in these variables are **not** considered sensitive or confidential. Any values provided in these variables will be available in plain text.`}
      <Spacing />
      <MarkdownTable
        data={
          getPropertiesList<Env>(context.env.vars)
            .filter(
              property =>
                getPropertiesList<Env>(context.env.vars).some(
                  p => p.name === property.name && p.active
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
                type: stringifyType<any>(property as JsonSchema<any>)
                  .trim()
                  .replaceAll(/\s*(?:\||&)\s*/g, ", or "),
                defaultValue: property.default
                  ? stringifyType(property.default)
                  : "",
                required: property.nullable ? "" : "✔"
              };
            }) ?? []
        }
      />
    </MarkdownFile>
  );
}
