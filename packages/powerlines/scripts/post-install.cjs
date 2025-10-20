#!/usr/bin/env node
'use strict';

var logger = require('@storm-software/config-tools/logger');
var fs = require('fs');
var promises = require('fs/promises');
var path = require('path');

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var currentWorkingDir = process.argv[2] || process.cwd();
function getPatchId(id) {
  return `deepkit_type_patch_${id}`;
}
__name(getPatchId, "getPatchId");
function getCode(deepkitDistPath, varName, id) {
  return `
  //${getPatchId(id)}

  try {
    var typeTransformer;

    try {
      typeTransformer = require("powerlines/deepkit/type-compiler");
    } catch (error) {
      typeTransformer = require(${JSON.stringify(deepkitDistPath)});
    }

    if (typeTransformer) {
      if (!customTransformers) {
        ${varName} = {};
      }

      if (!${varName}.before) {
        ${varName}.before = [];
      }

      let alreadyPatched = false;
      for (let fn of ${varName}.before) {
        if (fn && fn.name === "deepkitTransformer") {
          alreadyPatched = true;
        }
      }

      if (!alreadyPatched) {
        if (!${varName}.before.includes(typeTransformer.transformer)) {
          ${varName}.before.push(typeTransformer.transformer);
        }

        if (!${varName}.afterDeclarations) {
          ${varName}.afterDeclarations = [];
        }

        if (!${varName}.afterDeclarations.includes(typeTransformer.declarationTransformer)) {
          ${varName}.afterDeclarations.push(typeTransformer.declarationTransformer);
        }
      }
    }
  } catch {
    // Do nothing
  }

  //${getPatchId(id)}-end
`;
}
__name(getCode, "getCode");
function isPatched(code, id) {
  return code.includes(getPatchId(id));
}
__name(isPatched, "isPatched");
function patchGetTransformers(deepkitDistPath, code) {
  const id = "patchGetTransformers";
  if (isPatched(code, id)) {
    return "";
  }
  const find = /function getTransformers\([^)]+\)\s*\{/;
  if (!code.match(find)) {
    return "";
  }
  code = code.replace(find, (substring) => {
    return `${substring}
    ${getCode(deepkitDistPath, "customTransformers", id)}`;
  });
  return code;
}
__name(patchGetTransformers, "patchGetTransformers");
var postinstallTimeout = setTimeout(() => {
  logger.writeError("powerlines@post-install: Timeout reached.", {
    logLevel: "all"
  });
  process.exit(0);
}, 3e4);
(async () => {
  const start = /* @__PURE__ */ new Date();
  try {
    logger.writeInfo("powerlines@post-install: Patching TypeScript package with Deepkit transformer", {
      logLevel: "all"
    });
    const typeScriptPath = path.dirname(__require.resolve("typescript", {
      paths: [
        path.join(currentWorkingDir, "..")
      ]
    }));
    const deepkitDistPath = path.relative(typeScriptPath, __dirname);
    const paths = [
      "tsc.js",
      "_tsc.js",
      "typescript.js"
    ];
    for (const fileName of paths) {
      const file = path.join(typeScriptPath, fileName);
      if (!fs.existsSync(file)) {
        continue;
      }
      const content = patchGetTransformers(deepkitDistPath, await promises.readFile(file, "utf8"));
      if (!content) {
        continue;
      }
      await promises.writeFile(file, content);
      logger.writeSuccess(`powerlines@post-install: Injected Deepkit TypeScript transformer at ${file}`, {
        logLevel: "all"
      });
    }
  } catch (e) {
    logger.writeError(`powerlines@post-install: Exception occurred - ${e?.message}`, {
      logLevel: "all"
    });
  } finally {
    const end = /* @__PURE__ */ new Date();
    logger.writeDebug(`powerlines@post-install: Process took ${end.getTime() - start.getTime()}ms`, {
      logLevel: "all"
    });
    clearTimeout(postinstallTimeout);
    process.exit(0);
  }
})();
process.on("uncaughtException", (e) => {
  logger.writeFatal(`powerlines@post-install: Uncaught Exception occurred - ${e.message}`, {
    logLevel: "all"
  });
  process.exit(0);
});
process.on("unhandledRejection", (e) => {
  logger.writeFatal(`powerlines@post-install: Unhandled Rejection occurred - ${e?.message}`, {
    logLevel: "all"
  });
  process.exit(0);
});
