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

import alloyPlugin from "@alloy-js/babel-plugin";
import jsxDomExpressionsPlugin from "@alloy-js/babel-plugin-jsx-dom-expressions";
import {
  Children,
  flushJobsAsync,
  getContextForRenderNode,
  isPrintHook,
  RenderedTextTree,
  renderTree
} from "@alloy-js/core";
import transformTypescriptPlugin from "@babel/plugin-transform-typescript";
import babel from "@powerlines/plugin-babel";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { StormJSON } from "@stryke/json/storm-json";
import { isParentPath } from "@stryke/path/is-parent-path";
import { replacePath } from "@stryke/path/replace";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { PluginContext } from "powerlines/types/context";
import { Plugin } from "powerlines/types/plugin";
import { Doc } from "prettier";
import { printer } from "prettier/doc.js";
import { Output } from "./core/components/output";
import { OutputDirectory, OutputFile } from "./types/components";
import { AlloyPluginContext, AlloyPluginOptions } from "./types/plugin";

export * from "./core";
export * from "./helpers";
export * from "./markdown";
export * from "./types";
export * from "./typescript";

/**
 * Alloy-js plugin for Powerlines.
 *
 * @param options - The Alloy-js plugin user configuration options.
 * @returns A Powerlines plugin that integrates Alloy-js transformations.
 */
export const plugin = <
  TContext extends AlloyPluginContext = AlloyPluginContext
>(
  options: AlloyPluginOptions = {}
) => {
  return [
    babel({
      plugins: [
        [
          alloyPlugin,
          {
            alloyModuleName: "@alloy-js/core"
          }
        ],
        [
          jsxDomExpressionsPlugin,
          {
            alloyModuleName: "@alloy-js/core",
            moduleName: "@alloy-js/core/jsx-runtime",
            generate: "universal",
            wrapConditionals: true,
            preserveWhitespace: true
          }
        ],
        [
          transformTypescriptPlugin,
          {
            allowDeclareFields: true,
            isTSX: true
          }
        ]
      ]
    }),
    {
      name: "alloy:config",
      config() {
        return {
          alloy: {
            typescript: true,
            ...options
          },
          build: {
            inputOptions: {
              transform: {
                jsx: "react-jsx"
              }
            }
          }
        };
      },
      async configResolved() {
        if (
          this.tsconfig.tsconfigJson.compilerOptions?.jsx !== "react-jsx" ||
          this.tsconfig.tsconfigJson.compilerOptions?.jsxImportSource !==
            "@alloy-js/core"
        ) {
          this.tsconfig.tsconfigJson.compilerOptions ??= {};

          if (this.tsconfig.tsconfigJson.compilerOptions.jsx !== "react-jsx") {
            this.tsconfig.tsconfigJson.compilerOptions.jsx = "react-jsx";
          }

          if (
            this.tsconfig.tsconfigJson.compilerOptions.jsxImportSource !==
            "@alloy-js/core"
          ) {
            this.tsconfig.tsconfigJson.compilerOptions.jsxImportSource =
              "@alloy-js/core";
          }

          await this.fs.write(
            this.tsconfig.tsconfigFilePath,
            StormJSON.stringify(this.tsconfig.tsconfigJson)
          );
        }

        this.devDependencies["@alloy-js/core"] = "^0.21.0";

        if (this.config.alloy?.typescript !== false) {
          this.devDependencies["@alloy-js/typescript"] = "^0.21.0";
        }

        if (this.config.alloy?.json === true) {
          this.devDependencies["@alloy-js/json"] = "^0.21.0";
        }

        if (this.config.alloy?.markdown === true) {
          this.devDependencies["@alloy-js/markdown"] = "^0.21.0";
        }
      }
    },
    {
      name: "alloy:update-context",
      configResolved: {
        order: "pre",
        async handler() {
          this.render = async (children: Children) => {
            const tree = renderTree(
              <Output<TContext>
                context={this}
                basePath={this.workspaceConfig.workspaceRoot}>
                {children}
              </Output>
            );

            await writeTree(this, tree, this.config.alloy);
          };
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;

/**
 * Writes the rendered output files to the virtual file system.
 *
 * @param context - The context of the current build.
 * @param tree - The rendered output files.
 */
async function writeTree<TContext extends PluginContext = PluginContext>(
  context: TContext,
  tree: RenderedTextTree,
  options: AlloyPluginOptions = {}
) {
  await flushJobsAsync();

  let result!: OutputDirectory;
  const generateOutput = async (
    currentDirectory: OutputDirectory | undefined,
    root: RenderedTextTree
  ) => {
    if (!Array.isArray(root)) {
      return;
    }

    const recurse = async (cwd: OutputDirectory | undefined) => {
      for (const child of root) {
        await generateOutput(cwd, child as RenderedTextTree);
      }
    };

    const renderContext = getContextForRenderNode(root);
    if (!renderContext) {
      return recurse(currentDirectory);
    }

    if (renderContext.meta?.directory) {
      const directory: OutputDirectory = {
        kind: "directory",
        path: renderContext.meta.directory.path,
        contents: []
      };

      if (currentDirectory) {
        currentDirectory.contents.push(directory);
      } else {
        result = directory;
      }

      await recurse(directory);
    } else if (renderContext.meta?.sourceFile) {
      if (!currentDirectory) {
        // This shouldn't happen if you're using the Output component.
        throw new Error(
          "Source file doesn't have parent directory. Make sure you have used the Output component."
        );
      }

      let outputFile!: OutputFile;
      if (renderContext.meta?.builtin) {
        if (!renderContext.meta.builtin.id) {
          throw new Error(
            "Built-in runtime module doesn't have an ID. Make sure you have used the `<BuiltinFile />` component."
          );
        }

        context.log(
          LogLevelLabel.TRACE,
          `Rendering built-in runtime module with ID: ${renderContext.meta.builtin.id}`
        );

        outputFile = {
          kind: "builtin",
          id: renderContext.meta.builtin.id,
          path: replacePath(
            renderContext.meta.sourceFile.path,
            context.builtinsPath
          ),
          filetype: renderContext.meta.sourceFile.filetype,
          preset: renderContext.meta.output?.mode,
          contents: await printTree(context, root, options)
        };
      } else if (
        renderContext.meta?.entry ||
        isParentPath(context.entryPath, renderContext.meta.sourceFile.path)
      ) {
        context.log(
          LogLevelLabel.TRACE,
          `Rendering entry module at path: ${renderContext.meta.sourceFile.path}`
        );

        outputFile = {
          kind: "entry",
          typeDefinition: renderContext.meta.entry?.typeDefinition,
          path: renderContext.meta.sourceFile.path,
          filetype: renderContext.meta.sourceFile.filetype,
          preset: renderContext.meta.output?.mode,
          contents: await printTree(context, root, options)
        };
      } else {
        context.log(
          LogLevelLabel.TRACE,
          `Rendering source file at path: ${renderContext.meta.sourceFile.path}`
        );

        outputFile = {
          kind: "file",
          path: renderContext.meta.sourceFile.path,
          filetype: renderContext.meta.sourceFile.filetype,
          preset: renderContext.meta.output?.mode,
          contents: await printTree(context, root, options)
        };
      }

      currentDirectory.contents.push(outputFile);
    } else if (renderContext.meta?.copyFile) {
      if (!currentDirectory) {
        // This shouldn't happen if you're using the Output component.
        throw new Error(
          "Copy file doesn't have parent directory. Make sure you have used the Output component."
        );
      }

      context.log(
        LogLevelLabel.TRACE,
        `Processing copy file operation from "${
          renderContext.meta.copyFile.sourcePath
        }" to "${renderContext.meta.copyFile.path}"`
      );

      if (!renderContext.meta.copyFile.sourcePath) {
        throw new Error(
          "Copy file doesn't have a source path. Make sure you have provided a `sourcePath` property to the `meta.copyFile` context."
        );
      }

      if (!renderContext.meta.copyFile.path) {
        throw new Error(
          "Copy file doesn't have a destination path. Make sure you have provided a `path` property to the `meta.copyFile` context."
        );
      }

      currentDirectory.contents.push({
        kind: "file",
        path: renderContext.meta.copyFile.path,
        sourcePath: renderContext.meta.copyFile.sourcePath,
        preset: renderContext.meta.output?.preset
      });
    } else {
      await recurse(currentDirectory);
    }
  };

  await generateOutput(undefined, tree);

  const writeOutput = async (context: TContext, output: OutputDirectory) => {
    for (const sub of output.contents) {
      if (sub.kind === "directory") {
        await writeOutput(context, sub);
      } else if (sub.kind === "builtin") {
        await context.emitBuiltin(sub.contents, sub.id, sub.path);
      } else if (sub.kind === "entry") {
        await context.emitEntry(sub.contents, sub.path, sub.typeDefinition);
      } else if (sub.kind === "file") {
        if ("sourcePath" in sub && sub.sourcePath) {
          if (!context.fs.existsSync(sub.sourcePath)) {
            throw new Error(
              `Source file "${sub.sourcePath}" for copy operation does not exist.`
            );
          }

          const source = await context.fs.read(sub.sourcePath);
          if (!isSetString(source)) {
            throw new Error(
              `Source file "${sub.sourcePath}" for copy operation is empty.`
            );
          }

          await context.fs.write(sub.path, source);
        } else if ("contents" in sub && isSetString(sub.contents)) {
          await context.fs.write(sub.path, sub.contents);
        } else {
          throw new Error(
            `Unexpected output extracted from the render tree: \n\n${JSON.stringify(sub, null, 2)}`
          );
        }
      }
    }
  };

  await writeOutput(context, result);
}

async function printTree<TContext extends PluginContext = PluginContext>(
  context: TContext,
  tree: RenderedTextTree,
  options: AlloyPluginOptions = {}
) {
  options.printWidth ??= 160;
  options.tabWidth ??= 2;
  options.useTabs ??= false;
  options.insertFinalNewLine ??= true;

  await flushJobsAsync();

  const result = printer.printDocToString(
    printTreeWorker(tree),
    options as printer.Options
  ).formatted;

  return options.insertFinalNewLine && !result.endsWith("\n")
    ? `${result}\n`
    : result;
}

function printTreeWorker(tree: RenderedTextTree): Doc {
  const doc: Doc = [];
  for (const node of tree) {
    if (typeof node === "string") {
      const normalizedNode = node
        .split(/\r?\n/)
        .flatMap((line, index, array) =>
          index < array.length - 1 ? [line] : [line]
        );
      doc.push(normalizedNode);
    } else if (isPrintHook(node)) {
      doc.push(node.print!(node.subtree, printTreeWorker));
    } else {
      doc.push(printTreeWorker(node));
    }
  }

  return doc;
}
