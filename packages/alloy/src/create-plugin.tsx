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

import {
  flushJobsAsync,
  getContextForRenderNode,
  isPrintHook,
  RenderedTextTree,
  renderTree
} from "@alloy-js/core";
import { PluginPluginAlloyOptions } from "@powerlines/plugin-plugin/types/plugin";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { isParentPath } from "@stryke/path/is-parent-path";
import { replacePath } from "@stryke/path/replace";
import { isSetString } from "@stryke/type-checks/is-set-string";
import {
  getHookHandler,
  isPluginHook,
  isPluginHookFunction,
  isPluginHookObject
} from "powerlines/lib/utilities/plugin-helpers";
import { PluginContext } from "powerlines/types/context";
import { Plugin } from "powerlines/types/plugin";
import { Doc } from "prettier";
import { printer } from "prettier/doc.js";
import { Output } from "./core/components/output";
import { OutputDirectory, OutputFile } from "./types/components";
import { AlloyPluginBuilder, AlloyPluginOptions } from "./types/plugin";

/**
 * Creates an Alloy plugin using a plugin builder function.
 *
 * @param builder - The Alloy plugin builder function.
 * @returns An object representing the Alloy plugin.
 */
export function createAlloyPlugin<
  TOptions = any,
  TContext extends PluginContext = PluginContext
>(builder: AlloyPluginBuilder<TOptions, TContext>) {
  return async (
    options: TOptions &
      AlloyPluginOptions &
      Partial<Omit<Plugin<TContext>, "name">>
  ): Promise<Plugin<TContext>> => {
    const result = await Promise.resolve(builder(options));

    return {
      ...result,
      async prepare() {
        if (
          isPluginHook(result.prepare) &&
          result.enforce !== "post" &&
          (isPluginHookFunction(result.prepare) ||
            (isPluginHookObject(result.prepare) &&
              result.prepare.order !== "post"))
        ) {
          await Promise.resolve(getHookHandler(result.prepare).call(this));
        }

        if (isPluginHook(result.render)) {
          const tree = renderTree(
            <Output<TContext>
              context={this}
              basePath={this.workspaceConfig.workspaceRoot}>
              {result.render.call(this)}
            </Output>
          );

          await writeTree(this, tree, options?.alloy);
        }

        if (
          isPluginHook(result.prepare) &&
          (result.enforce === "post" ||
            (isPluginHookObject(result.prepare) &&
              result.prepare.order === "post"))
        ) {
          await Promise.resolve(getHookHandler(result.prepare).call(this));
        }
      }
    } as Plugin<TContext>;
  };
}

/**
 * Writes the rendered output files to the virtual file system.
 *
 * @param context - The context of the current build.
 * @param tree - The rendered output files.
 */
async function writeTree<TContext extends PluginContext = PluginContext>(
  context: TContext,
  tree: RenderedTextTree,
  options: PluginPluginAlloyOptions = {}
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
          mode: renderContext.meta.output?.mode,
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
          mode: renderContext.meta.output?.mode,
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
          mode: renderContext.meta.output?.mode,
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
        mode: renderContext.meta.output?.mode
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
        await context.fs.writeBuiltinFile(
          sub.id,
          replacePath(sub.path, context.builtinsPath),
          sub.contents,
          {
            mode: sub.mode,
            skipFormat: false
          }
        );
      } else if (sub.kind === "entry") {
        await context.fs.writeEntryFile(sub.path, sub.contents, {
          mode: sub.mode,
          skipFormat: false
        });
      } else if (sub.kind === "file") {
        if ("sourcePath" in sub && sub.sourcePath) {
          if (!context.fs.existsSync(sub.sourcePath)) {
            throw new Error(
              `Source file "${sub.sourcePath}" for copy operation does not exist.`
            );
          }

          const source = await context.fs.readFile(sub.sourcePath);
          if (!isSetString(source)) {
            throw new Error(
              `Source file "${sub.sourcePath}" for copy operation is empty.`
            );
          }

          await context.fs.writeFile(sub.path, source, {
            mode: sub.mode
          });
        } else if ("contents" in sub && isSetString(sub.contents)) {
          await context.fs.writeFile(sub.path, sub.contents, {
            mode: sub.mode
          });
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
  options: PluginPluginAlloyOptions = {}
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
