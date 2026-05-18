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

/**
 * The main entry point for the Powerlines library, which provides a build toolkit and runtime for NodeJS applications.
 *
 * @remarks
 * Powerlines is a build toolkit and runtime used by Storm Software in TypeScript applications, designed to streamline development and enhance productivity. It offers a powerful engine for executing build tasks, a flexible plugin system for extending functionality, and a rich set of utilities for working with schemas, code generation, and more.
 *
 * @packageDocumentation
 */

export * from "./config";
export * from "./plugin-utils";
export * from "./storage";
export type * from "./types";

export * from "@powerlines/core";
