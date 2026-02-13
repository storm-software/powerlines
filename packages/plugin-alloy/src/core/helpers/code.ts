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

import { code as baseCode, Children } from "@alloy-js/core";

/**
 * Turn the provided string template into Children by replacing literal line
 * breaks with hardlines and automatically indenting indented content. Similar
 * in spirit to the `<code>` element in HTML.
 *
 * @see {@link text} for a similar function which treats whitespace similar to
 * JSX template bodies.
 *
 * @example
 * ```ts
 * code`
 *   function greet(name: string) {
 *     console.log("Hello, " + name + "!");
 *   }
 * `
 * ```
 *
 * @param template - The template string to be processed into Children.
 * @param substitutions - Any interpolated values within the template, which will be treated as Children and properly indented.
 * @returns A Children representation of the provided template string, with proper handling of line breaks and indentation.
 * @throws Will throw an error if the provided template contains only whitespace, as this is likely a mistake and would cause a less recognizable "Cannot read properties of undefined" exception later in the processing.
 */
export function code(
  template: TemplateStringsArray,
  ...substitutions: Children[]
): Children {
  if (
    template.filter(seg => seg.trim()).length === 0 &&
    substitutions.length === 0
  ) {
    throw new Error(
      "The `code` function cannot be used with a template that contains only whitespace. Please provide a non-empty template."
    );
  }

  return baseCode(template, ...substitutions);
}
