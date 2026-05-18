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

import astro from "./astro";
import farm from "./farm";
import next from "./next";
import nuxt from "./nuxt";
import rolldown from "./rolldown";
import rollup from "./rollup";
import rspack from "./rspack";
import tsdown from "./tsdown";
import tsup from "./tsup";
import unloader from "./unloader";
import vite from "./vite";

export type * from "./types";
export * from "./unplugin";

export const plugins = {
  astro,
  farm,
  next,
  nuxt,
  rolldown,
  rollup,
  rspack,
  tsdown,
  tsup,
  unloader,
  vite
};

export default plugins;
