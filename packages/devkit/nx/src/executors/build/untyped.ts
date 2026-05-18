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

import { defineUntypedSchema } from "untyped";
import PrepareExecutorSchema from "../prepare/untyped";

export default defineUntypedSchema({
  ...PrepareExecutorSchema,
  $schema: {
    id: "BuildExecutorSchema",
    title: "Build Executor",
    description: "A type definition for the Powerlines - Build executor schema",
    required: []
  },
  entry: {
    $schema: {
      title: "Entry Path(s)",
      description: "The entry path(s) for the package",
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }]
    }
  }
});
