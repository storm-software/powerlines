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
 * Zod schema for React plugin environment variables.
 */
export const reactEnvSchema = envSchema.extend({
  DISABLE_REACT_COMPILER: z.boolean().meta({
    description:
      "Disables the React compiler optimizations when set to true. This environment variable can be used to turn off the optimizations provided by the React compiler, which may be useful for debugging or development purposes."
  })
});

/**
 * Inferred React environment configuration type from {@link reactEnvSchema}.
 */
export type ReactEnv = z.infer<typeof reactEnvSchema>;
