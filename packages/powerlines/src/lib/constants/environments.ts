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

export const DEFAULT_ENVIRONMENT = "default" as const;
export const GLOBAL_ENVIRONMENT = "__global__" as const;

// General environment names that can be used in plugins and configurations
export const CLIENT_ENVIRONMENT = "client" as const;
export const SERVER_ENVIRONMENT = "server" as const;
export const SSR_ENVIRONMENT = "ssr" as const;
export const RSC_ENVIRONMENT = "rsc" as const;
