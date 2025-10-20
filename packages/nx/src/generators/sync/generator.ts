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

import { readNxJson, Tree } from "@nx/devkit";
import { SyncGeneratorResult } from "nx/src/utils/sync-generators";
import type { SyncGeneratorSchema } from "./schema";

export async function generatorFn(tree: Tree): Promise<SyncGeneratorResult> {
  // if (
  //   !tree.exists("/legal-message.txt") ||
  //   tree.read("/legal-message.txt").toString() !==
  //     "This is an important legal message."
  // ) {
  //   tree.write("/legal-message.txt", "This is an important legal message.");
  // }

  // const persistedMeta = await getPersistedMeta(this.context);
  // const checksum = await getChecksum(this.context.options.projectRoot);

  // const projectGraph = await createProjectGraphAsync();
  // Object.values(projectGraph.nodes).forEach(project => {
  //   tree.write(
  //     joinPathFragments(project.data.root, "license.txt"),
  //     `${project.name} uses the Acme Corp license.`
  //   );
  // });

  const nxJson = readNxJson(tree);
  const userOptions = nxJson?.sync?.generatorOptions?.[
    "@powerlines/nx:sync"
  ] as SyncGeneratorSchema;

  // const projectGraph = await createProjectGraphAsync();
  // const projectRoots = new Set<string>();

  return {
    outOfSyncMessage:
      userOptions?.outOfSyncMessage ||
      "The legal-message.txt file needs to be created"
  };
}

export default generatorFn;

// export default withRunGenerator("Powerlines sync generator", generatorFn, {
//   skipReadingConfig: true
// });
