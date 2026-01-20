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

import { NodePath, PluginPass, Visitor } from "@babel/core";
import { BabelAPI, declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";
import { appendPath } from "@stryke/path/append";
import { findFilePath, relativePath } from "@stryke/path/file-path-fns";
import { isAbsolutePath } from "@stryke/path/is-type";
import { replaceExtension } from "@stryke/path/replace";
import { isBuiltinModule } from "../../plugin-utils/modules";
import { Context } from "../../types/context";

type ModuleResolverPluginPass = PluginPass & {
  context: Context;
  moduleResolverVisited: Set<any>;
  api: BabelAPI;
  resolveAll: boolean;
};

function resolveModulePath(
  nodePath: NodePath<t.StringLiteral | null | undefined>,
  state: ModuleResolverPluginPass
) {
  if (
    !t.isStringLiteral(nodePath.node) ||
    (!state.resolveAll && !isBuiltinModule(state.context, nodePath.node.value))
  ) {
    return;
  }

  let resolvedPath = state.context?.fs.resolveSync(nodePath.node.value);
  if (resolvedPath) {
    if (state.filename) {
      const currentFile = state.context?.fs.resolveSync(
        !isAbsolutePath(state.filename) && state.cwd
          ? appendPath(state.filename, state.cwd)
          : state.filename
      );
      if (currentFile && isAbsolutePath(currentFile)) {
        resolvedPath = relativePath(findFilePath(currentFile), resolvedPath);
      }

      nodePath.replaceWith(t.stringLiteral(replaceExtension(resolvedPath)));
    }
  }
}

const TRANSFORM_FUNCTIONS = [
  "require",
  "require.resolve",
  "System.import",

  // Jest methods
  "jest.genMockFromModule",
  "jest.mock",
  "jest.unmock",
  "jest.doMock",
  // eslint-disable-next-line @cspell/spellchecker
  "jest.dontMock",
  "jest.setMock",
  "jest.requireActual",
  "jest.requireMock",

  // Older Jest methods
  "require.requireActual",
  "require.requireMock"
];

function matchesPattern(
  state: ModuleResolverPluginPass,
  calleePath: NodePath,
  pattern: string
) {
  const { node } = calleePath;

  if (t.isMemberExpression(node)) {
    return calleePath.matchesPattern(pattern);
  }

  if (!t.isIdentifier(node) || pattern.includes(".")) {
    return false;
  }

  const name = pattern.split(".")[0];

  return node.name === name;
}

const importVisitors = {
  CallExpression: (
    nodePath: NodePath<t.CallExpression>,
    state: ModuleResolverPluginPass
  ) => {
    if (state.moduleResolverVisited.has(nodePath)) {
      return;
    }

    const calleePath = nodePath.get("callee");
    if (
      (calleePath &&
        TRANSFORM_FUNCTIONS.some(pattern =>
          matchesPattern(state, calleePath, pattern)
        )) ||
      t.isImport(nodePath.node.callee)
    ) {
      state.moduleResolverVisited.add(nodePath);
      resolveModulePath(
        nodePath.get("arguments.0") as NodePath<t.StringLiteral>,
        state
      );
    }
  },
  // eslint-disable-next-line ts/naming-convention
  "ImportDeclaration|ExportDeclaration|ExportAllDeclaration": (
    nodePath: NodePath<
      t.ImportDeclaration | t.ExportDeclaration | t.ExportAllDeclaration
    >,
    state: ModuleResolverPluginPass
  ) => {
    if (
      !nodePath ||
      !nodePath.get("source") ||
      state.moduleResolverVisited.has(nodePath)
    ) {
      return;
    }

    state.moduleResolverVisited.add(nodePath);
    resolveModulePath(nodePath.get("source"), state);
  }
} as Visitor<ModuleResolverPluginPass>;

export interface ModuleResolverBabelPluginOptions {
  /**
   * Whether to resolve all module paths, including non-builtin modules.
   *
   * @default false
   */
  resolveAll?: boolean;
}

/**
 * Babel plugin to resolve module paths for built-in Powerlines modules.
 *
 * @param context - The Powerlines context.
 * @param options - Configuration options for the plugin.
 * @returns A Babel plugin object.
 */
export const moduleResolverBabelPlugin = (
  context: Context,
  options?: ModuleResolverBabelPluginOptions
) => {
  return declare(function builder(api: BabelAPI) {
    let moduleResolverVisited = new Set();

    return {
      name: "powerlines:module-resolver",

      pre() {
        // We need to keep track of all handled nodes so we do not try to transform them twice,
        // because we run before (enter) and after (exit) all nodes are handled
        moduleResolverVisited = new Set();
      },

      visitor: {
        Program: {
          enter(programPath: NodePath<t.Program>, state: PluginPass) {
            programPath.traverse(importVisitors, {
              ...state,
              context,
              moduleResolverVisited,
              api,
              resolveAll: options?.resolveAll ?? false
            } as ModuleResolverPluginPass);
          },
          exit(programPath, state) {
            programPath.traverse(importVisitors, {
              ...state,
              context,
              moduleResolverVisited,
              api,
              resolveAll: options?.resolveAll ?? false
            } as ModuleResolverPluginPass);
          }
        }
      },

      post() {
        moduleResolverVisited.clear();
      }
    };
  });
};
