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

import { correctPath } from "@stryke/path/correct-path";

/**
 * Resolve an output template (string or function) into an actual path string.
 *
 * @remarks
 * - If `outputTemplate` is a function, call it with (language, namespace)
 * - If it's a string, replace placeholders:
 *    - \{\{language\}\} or \{\{lng\}\} -\> language
 *    - \{\{namespace\}\} -\> namespace (or removed if namespace is undefined)
 * - Normalizes duplicate slashes and returns a platform-correct path.
 */
export function getOutputPath(
  outputTemplate:
    | string
    | ((language: string, namespace?: string) => string)
    | undefined,
  language: string,
  namespace?: string
): string {
  if (!outputTemplate) {
    // Fallback to a sensible default
    return correctPath(
      `locales/${language}/${namespace ?? "translation"}.json`
    );
  }

  if (typeof outputTemplate === "function") {
    try {
      const result = String(outputTemplate(language, namespace));

      return correctPath(result.replace(/\/{2,}/g, "/"));
    } catch {
      // If user function throws, fallback to default path
      return correctPath(
        `locales/${language}/${namespace ?? "translation"}.json`
      );
    }
  }

  // It's a string template
  let out = String(outputTemplate);
  out = out.replace(/\{\{language\}\}|\{\{lng\}\}/g, language);

  if (namespace !== undefined && namespace !== null) {
    out = out.replace(/\{\{namespace\}\}/g, namespace);
  } else {
    // remove any occurrences of /{{namespace}} or {{namespace}} (keeping surrounding slashes tidy)
    out = out.replace(/\/?\{\{namespace\}\}/g, "");
  }

  // collapse duplicate slashes and normalize to platform-specific separators
  out = out.replace(/\/{2,}/g, "/");
  return correctPath(out);
}
