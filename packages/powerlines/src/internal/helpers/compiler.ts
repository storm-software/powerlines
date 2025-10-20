// /* -------------------------------------------------------------------

//                   ⚡ Storm Software - Powerlines

//  This code was released as part of the Powerlines project. Powerlines
//  is maintained by Storm Software under the Apache-2.0 license, and is
//  free for commercial and private use. For more information, please visit
//  our licensing page at https://stormsoftware.com/licenses/projects/powerlines.

//  Website:                  https://stormsoftware.com
//  Repository:               https://github.com/storm-software/powerlines
//  Documentation:            https://docs.stormsoftware.com/projects/powerlines
//  Contact:                  https://stormsoftware.com/contact

//  SPDX-License-Identifier:  Apache-2.0

//  ------------------------------------------------------------------- */

// import { LogLevelLabel } from "@storm-software/config-tools/types";
// import { existsSync } from "@stryke/fs/exists";
// import { createDirectorySync } from "@stryke/fs/helpers";
// import { isParentPath } from "@stryke/path/is-parent-path";
// import { joinPaths } from "@stryke/path/join-paths";
// import type MagicString from "magic-string";
// import { transform } from "../../lib/babel/transform";
// import { extendLog } from "../../lib/logger";
// import { transpile } from "../../lib/typescript/transpile";
// import { getCache, setCache } from "../../lib/utilities/cache";
// import { getSourceFile, getString } from "../../lib/utilities/source-file";
// import { generateSourceMap } from "../../lib/utilities/source-map";
// import {
//   CompilerInterface,
//   CompilerOptions,
//   CompilerResult,
//   SourceFile,
//   TranspilerOptions
// } from "../../types/compiler";
// import { LogFn } from "../../types/config";
// import { Context } from "../../types/context";

// export class Compiler<TContext extends Context = Context>
//   implements CompilerInterface
// {
//   #cache: WeakMap<SourceFile, string> = new WeakMap();

//   #options: CompilerOptions<TContext>;

//   #context: TContext;

//   /**
//    * The logger function to use
//    */
//   protected log: LogFn;

//   /**
//    * Create a new compiler instance.
//    *
//    * @param context - The compiler context.
//    * @param options - The compiler options.
//    */
//   constructor(context: TContext, options: CompilerOptions<TContext> = {}) {
//     this.log = extendLog(context.log, "compiler");
//     this.#options = options;
//     this.#context = context;

//     if (!existsSync(joinPaths(context.cachePath, "compiler"))) {
//       createDirectorySync(joinPaths(context.cachePath, "compiler"));
//     }
//   }

//   /**
//    * Transform the module.
//    *
//    * @param code - The source code to compile.
//    * @param id - The name of the file to compile.
//    * @param options - The transpile options.
//    * @returns The transpiled module.
//    */
//   public async transform(
//     code: string | MagicString,
//     id: string,
//     options: CompilerOptions = {}
//   ): Promise<string> {
//     if (this.shouldSkip(code, id)) {
//       this.log(LogLevelLabel.TRACE, `Skipping transform for ${id}`);
//       return getString(code);
//     }

//     this.log(LogLevelLabel.TRACE, `Transforming ${id}`);

//     let source = getSourceFile(code, id);

//     if (options.onPreTransform) {
//       this.log(
//         LogLevelLabel.TRACE,
//         `Running onPreTransform hook for ${source.id}`
//       );

//       source = await Promise.resolve(
//         options.onPreTransform(this.#context, source)
//       );
//     }

//     if (this.#options.onPreTransform) {
//       this.log(
//         LogLevelLabel.TRACE,
//         `Running onPreTransform hook for ${source.id}`
//       );

//       source = await Promise.resolve(
//         this.#options.onPreTransform(this.#context, source)
//       );
//     }

//     if (!options.skipAllTransforms) {
//       this.log(LogLevelLabel.TRACE, `Running transforms for ${source.id}`);

//       source = await transform(this.log, this.#context, source, options);
//       this.log(
//         LogLevelLabel.TRACE,
//         `Completed transformations for ${source.id}`
//       );
//     }

//     if (this.#options.onPostTransform) {
//       this.log(
//         LogLevelLabel.TRACE,
//         `Running onPostTransform hook for ${source.id}`
//       );

//       source = await Promise.resolve(
//         this.#options.onPostTransform(this.#context, source)
//       );
//     }

//     if (options.onPostTransform) {
//       this.log(
//         LogLevelLabel.TRACE,
//         `Running onPostTransform hook for ${source.id}`
//       );

//       source = await Promise.resolve(
//         options.onPostTransform(this.#context, source)
//       );
//     }

//     return getString(source.code);
//   }

//   /**
//    * Transpile the module.
//    *
//    * @param code - The source code to compile.
//    * @param id - The name of the file to compile.
//    * @returns The transpiled module.
//    */
//   public async transpile(
//     code: string | MagicString,
//     id: string,
//     options: TranspilerOptions = {}
//   ): Promise<string> {
//     this.log(
//       LogLevelLabel.TRACE,
//       `Transpiling ${id} module with TypeScript compiler`
//     );

//     const transpiled = transpile(this.#context, getString(code), id, options);
//     if (transpiled === null) {
//       this.log(LogLevelLabel.ERROR, `Transform is null: ${id}`);

//       throw new Error(`Transform is null: ${id}`);
//     } else {
//       this.log(LogLevelLabel.TRACE, `Transformed: ${id}`);
//     }

//     return transpiled.outputText;
//   }

//   /**
//    * Compile the source code.
//    *
//    * @param code - The source code to compile.
//    * @param id - The name of the file to compile.
//    * @returns The compiled source code and source map.
//    */
//   public async compile(
//     code: string | MagicString,
//     id: string,
//     options: CompilerOptions = {}
//   ): Promise<string> {
//     this.log(LogLevelLabel.TRACE, `Compiling ${id}`);

//     const source = getSourceFile(code, id);

//     let compiled: string | undefined;
//     if (!options.skipCache) {
//       compiled = await this.getCache(source);
//       if (compiled) {
//         this.log(LogLevelLabel.TRACE, `Cache hit: ${source.id}`);
//       } else {
//         this.log(LogLevelLabel.TRACE, `Cache miss: ${source.id}`);
//       }
//     }

//     if (!compiled) {
//       const transformed = await this.transform(source.code, source.id, options);

//       compiled = await this.transpile(transformed, source.id, options);
//       await this.setCache(source, compiled);
//     }

//     return compiled;
//   }

//   /**
//    * Get the result of the compiler.
//    *
//    * @param sourceFile - The source file.
//    * @param transpiled - The transpiled source code.
//    * @returns The result of the compiler.
//    */
//   public getResult(
//     sourceFile: SourceFile,
//     transpiled?: string
//   ): CompilerResult {
//     return generateSourceMap(sourceFile.code, sourceFile.id, transpiled);
//   }

//   protected async getCache(sourceFile: SourceFile) {
//     let cache = this.#cache.get(sourceFile);
//     if (cache) {
//       return cache;
//     }

//     if (this.#context.config.skipCache) {
//       return;
//     }

//     cache = await getCache(
//       sourceFile,
//       joinPaths(this.#context.cachePath, "compiler")
//     );
//     if (cache) {
//       this.#cache.set(sourceFile, cache);
//     }

//     return cache;
//   }

//   protected async setCache(sourceFile: SourceFile, transpiled?: string) {
//     if (transpiled) {
//       this.#cache.set(sourceFile, transpiled);
//     } else {
//       this.#cache.delete(sourceFile);
//     }

//     if (this.#context.config.skipCache) {
//       return;
//     }

//     return setCache(
//       sourceFile,
//       joinPaths(this.#context.cachePath, "compiler"),
//       transpiled
//     );
//   }

//   protected shouldSkip(code: string | MagicString, id: string): boolean {
//     if (
//       (process.env.STORM_STACK_LOCAL &&
//         isParentPath(id, this.#context.corePackagePath)) ||
//       getString(code).includes("/* @storm-ignore */") ||
//       getString(code).includes("/* @storm-disable */")
//     ) {
//       return true;
//     }

//     return false;
//   }
// }
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
