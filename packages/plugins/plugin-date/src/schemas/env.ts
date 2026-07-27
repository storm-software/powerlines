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

import { envSchema } from "@powerlines/plugin-env/schemas/env";
import * as z from "zod";

/**
 * Zod schema for date plugin environment variables.
 */
export const dateEnvSchema = envSchema.extend({
  LOCALE: z.string().optional().meta({
    description:
      'The locale to use for date formatting and parsing. This can be set via the `LOCALE` environment variable or the `DEFAULT_LOCALE` environment variable, with `LOCALE` taking precedence if both are set. If neither is set, it will default to "en-US".',
    runtime: true
  })
});

/**
 * Inferred date environment configuration type from {@link dateEnvSchema}.
 */
export type DateEnv = z.infer<typeof dateEnvSchema>;
