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
import { Heading, Link } from "@alloy-js/markdown";
import {
  ReflectionClass,
  stringifyType
} from "@powerlines/deepkit/vendor/type";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  MarkdownFile,
  MarkdownFileProps
} from "@powerlines/plugin-alloy/markdown/components/markdown-file";
import { MarkdownTable } from "@powerlines/plugin-alloy/markdown/components/markdown-table";
import { joinPaths } from "@stryke/path/join";
import { getDocsOutputPath } from "../helpers/docs-helper";
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

  reflection: ReflectionClass<any>;
}

/**
 * Generates the environment configuration markdown documentation for the Powerlines project.
 */
export function EnvDocsFile(props: EnvDocsFileProps) {
  const { levelOffset = 0, reflection, ...rest } = props;

  const context = usePowerlines<EnvPluginContext>();

  return (
    <MarkdownFile
      path={joinPaths(getDocsOutputPath(context), "env.md")}
      {...rest}>
      <Heading level={1 + levelOffset}>Environment Configuration</Heading>
      {code`Below is a list of environment variables used by the`}
      <Show when={!!context.packageJson.name}>
        <Link
          href={`https://www.npmjs.com/package/${context.packageJson.name}`}
          title={context.packageJson.name!}
        />
      </Show>
      {code`package. These values can be updated in the \`.env\` file in the root of the project.`}
      <hbr />
      <Heading level={2 + levelOffset}>Environment Variables</Heading>
      {code`The below list of environment variables are used as configuration parameters to drive the processing of the application. The data contained in these variables are **not** considered sensitive or confidential. Any values provided in these variables will be available in plain text to the public.`}
      <hbr />
      <MarkdownTable
        data={
          reflection
            ?.getProperties()
            .filter(
              property => property.getNameAsString() !== "__STORM_INJECTED__"
            )
            .sort((a, b) =>
              a.getNameAsString().localeCompare(b.getNameAsString())
            )
            .map(reflectionProperty => {
              return {
                name: reflectionProperty.getNameAsString().trim(),
                description: (reflectionProperty.getDescription() ?? "").trim(),
                type: stringifyType(reflectionProperty.getType())
                  .trim()
                  .replaceAll(" | ", ", or "),
                defaultValue: reflectionProperty.hasDefault()
                  ? String(reflectionProperty.getDefaultValue())?.includes('"')
                    ? reflectionProperty.getDefaultValue()
                    : `\`${reflectionProperty.getDefaultValue()}\``
                  : "",
                required: reflectionProperty.isValueRequired() ? "" : "✔"
              };
            }) ?? []
        }
      />
    </MarkdownFile>
  );
}
