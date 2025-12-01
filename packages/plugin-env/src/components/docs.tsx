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
import { usePowerlines } from "@powerlines/alloy/core/contexts/context";
import { MarkdownFile } from "@powerlines/alloy/markdown/components/markdown-file";
import { MarkdownTable } from "@powerlines/alloy/markdown/components/markdown-table";
import { stringifyType } from "@powerlines/deepkit/vendor/type";
import { joinPaths } from "@stryke/path/join";
import { createReflectionResource } from "../helpers/create-reflection-resource";
import { EnvPluginContext } from "../types/plugin";

/**
 * Generates the environment configuration markdown documentation for the Powerlines project.
 */
export function EnvDocs() {
  const context = usePowerlines<EnvPluginContext>();
  if (!context) {
    return null;
  }

  // Clean and recreate the output directories
  const reflection = createReflectionResource(context);

  return (
    <MarkdownFile
      path={joinPaths(
        context.config.projectRoot,
        "docs",
        "generated",
        "env.md"
      )}>
      <Heading level={1}>Environment Configuration</Heading>
      {code`Below is a list of environment variables used by the`}
      <Show when={!!context?.packageJson.name}>
        <Link
          href={`https://www.npmjs.com/package/${context?.packageJson.name}`}
          title={context.packageJson.name!}
        />
      </Show>
      {code`package. These values can be updated in the \`.env\` file in the root of the project.`}
      <hbr />
      <Heading level={2}>Environment Variables</Heading>
      {code`The below list of environment variables are used as configuration parameters to drive the processing of the application. The data contained in these variables are **not** considered sensitive or confidential. Any values provided in these variables will be available in plain text to the public.`}
      <hbr />
      <MarkdownTable
        data={
          reflection.data
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
