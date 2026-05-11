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

import type { CommandMetadata } from "@shell-shock/core";
import { createEngine } from "powerlines";

export const metadata = {
  title: "New Project",
  description: "Initialize a new Powerlines project.",
  icon: "⬚"
} satisfies CommandMetadata;

export interface NewOptions {
  /**
   * The root directory of the project to initialize. Defaults to the current working directory if not specified.
   *
   * @remarks
   * This option allows you to specify the base directory for the project initialization process, which can be useful if your project structure requires initializing the project from a different location than the default. If not provided, Powerlines will use the current working directory as the root for the project initialization process.
   */
  root: string;
}

async function handler(options: NewOptions) {
  const api = await createEngine({
    cwd: process.cwd(),
    root: options.root
  });
  await api.new({
    ...options,
    root: options.root,
    command: "new"
  });
}

export default handler;
