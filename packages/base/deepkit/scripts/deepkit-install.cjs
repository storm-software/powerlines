#!/usr/bin/env node
let _storm_software_config_tools_logger = require("@storm-software/config-tools/logger");
let node_fs = require("node:fs");
let node_fs_promises = require("node:fs/promises");
let node_path = require("node:path");

//#region scripts/deepkit-install.ts
/**
* This script installs the deepkit/type transformer (that extracts automatically types and adds the correct \@t decorator) to the typescript node_modules.
*
* The critical section that needs adjustment is in the `function getScriptTransformers` in `node_modules/typescript/lib/tsc.js`.
*/
const currentWorkingDir = process.argv[2] || process.cwd();
function getPatchId(id) {
	return `deepkit_type_patch_${id}`;
}
function getCode(deepkitDistPath, varName, id) {
	return `
  //${getPatchId(id)}

  try {
    var typeTransformer;

    try {
      typeTransformer = require("@powerlines/deepkit/vendor/type-compiler");
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
function isPatched(code, id) {
	return code.includes(getPatchId(id));
}
function patchGetTransformers(deepkitDistPath, code) {
	const id = "patchGetTransformers";
	if (isPatched(code, id)) return "";
	const find = /function getTransformers\([^)]+\)\s*\{/;
	if (!code.match(find)) return "";
	code = code.replace(find, (substring) => {
		return `${substring}\n    ${getCode(deepkitDistPath, "customTransformers", id)}`;
	});
	return code;
}
const deepkitInstallTimeout = setTimeout(() => {
	(0, _storm_software_config_tools_logger.writeError)("powerlines@deepkit-install: Timeout reached.", { logLevel: "all" });
	process.exit(0);
}, 3e4);
(async () => {
	const start = /* @__PURE__ */ new Date();
	try {
		(0, _storm_software_config_tools_logger.writeInfo)("powerlines@deepkit-install: Patching TypeScript package with Deepkit transformer", { logLevel: "all" });
		const typeScriptPath = (0, node_path.dirname)(require.resolve("typescript", { paths: [(0, node_path.join)(currentWorkingDir, "..")] }));
		const deepkitDistPath = (0, node_path.relative)(typeScriptPath, __dirname);
		for (const fileName of [
			"tsc.js",
			"_tsc.js",
			"typescript.js"
		]) {
			const file = (0, node_path.join)(typeScriptPath, fileName);
			if (!(0, node_fs.existsSync)(file)) continue;
			const content = patchGetTransformers(deepkitDistPath, await (0, node_fs_promises.readFile)(file, "utf8"));
			if (!content) continue;
			await (0, node_fs_promises.writeFile)(file, content);
			(0, _storm_software_config_tools_logger.writeSuccess)(`powerlines@deepkit-install: Injected Deepkit TypeScript transformer at ${file}`, { logLevel: "all" });
		}
	} catch (e) {
		(0, _storm_software_config_tools_logger.writeError)(`powerlines@deepkit-install: Exception occurred - ${e?.message}`, { logLevel: "all" });
	} finally {
		(0, _storm_software_config_tools_logger.writeDebug)(`powerlines@deepkit-install: Process took ${(/* @__PURE__ */ new Date()).getTime() - start.getTime()}ms`, { logLevel: "all" });
		clearTimeout(deepkitInstallTimeout);
		process.exit(0);
	}
})();
process.on("uncaughtException", (e) => {
	(0, _storm_software_config_tools_logger.writeFatal)(`powerlines@deepkit-install: Uncaught Exception occurred - ${e.message}`, { logLevel: "all" });
	process.exit(0);
});
process.on("unhandledRejection", (e) => {
	(0, _storm_software_config_tools_logger.writeFatal)(`powerlines@deepkit-install: Unhandled Rejection occurred - ${e?.message}`, { logLevel: "all" });
	process.exit(0);
});

//#endregion