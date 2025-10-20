#!/usr/bin/env node
'use strict';

var apiExtractor = require('@microsoft/api-extractor');
var logger = require('@storm-software/config-tools/logger');
var exists = require('@stryke/fs/exists');
var readFile = require('@stryke/fs/read-file');
var writeFile = require('@stryke/fs/write-file');
var joinPaths = require('@stryke/path/join-paths');

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var currentWorkingDir = process.argv[2] || process.cwd();
async function extractRuntimeDts(runtime) {
  const runtimeTypesFilePath = joinPaths.joinPaths(currentWorkingDir, "dist", "runtime-types", "esm");
  logger.writeInfo(`powerlines@build-runtime-types: Running API Extractor for ${runtime} runtime at ${runtimeTypesFilePath}`, {
    logLevel: "all"
  });
  const mainEntryPointFilePath = joinPaths.joinPaths(runtimeTypesFilePath, runtime === "shared" ? "index.d.ts" : joinPaths.joinPaths(runtime, "index.d.ts"));
  if (!exists.existsSync(mainEntryPointFilePath)) {
    throw new Error(`Could not resolve powerlines/runtime-types package location: ${mainEntryPointFilePath} does not exist.`);
  }
  const untrimmedFilePath = joinPaths.joinPaths(runtimeTypesFilePath, "..", `${runtime}.d.ts`);
  const extractorResult = apiExtractor.Extractor.invoke(apiExtractor.ExtractorConfig.prepare({
    configObject: {
      mainEntryPointFilePath,
      apiReport: {
        enabled: false,
        // `reportFileName` is not been used. It's just to fit the requirement of API Extractor.
        reportFileName: "report.api.md"
      },
      docModel: {
        enabled: false
      },
      dtsRollup: {
        enabled: true,
        untrimmedFilePath
      },
      tsdocMetadata: {
        enabled: false
      },
      compiler: {
        tsconfigFilePath: joinPaths.joinPaths(currentWorkingDir, "tsconfig.json")
      },
      projectFolder: currentWorkingDir,
      newlineKind: "lf"
    },
    configObjectFullPath: void 0,
    packageJsonFullPath: joinPaths.joinPaths(currentWorkingDir, "package.json")
  }), {
    localBuild: true,
    showVerboseMessages: true
  });
  if (!extractorResult.succeeded) {
    throw new Error(`API Extractor completed with ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings when processing powerlines/runtime-types package.`);
  }
  const dtsFileContent = await readFile.readFile(untrimmedFilePath);
  await writeFile.writeFile(untrimmedFilePath, dtsFileContent.replace(/\s*export.*__Ω.*;/g, "").replace(/^export\s*\{\s*\}\s*$/gm, "").replace(/^export\s*(?:declare\s*)?interface\s*/gm, "interface ").replace(/^export\s*(?:declare\s*)?type\s*/gm, "type ").replace(/^export\s*(?:declare\s*)?const\s*/gm, "declare const ").replace(/: Storage(?:_\d+)?;$/gm, ': import("unstorage").Storage<import("unstorage").StorageValue>;'));
  logger.writeSuccess(`powerlines@build-runtime-types: Generated TypeScript declaration file for ${runtime} runtime.`, {
    logLevel: "all"
  });
}
__name(extractRuntimeDts, "extractRuntimeDts");
var postinstallTimeout = setTimeout(() => {
  logger.writeError("powerlines@build-runtime-types: Timeout reached.", {
    logLevel: "all"
  });
  process.exit(0);
}, 3e4);
(async () => {
  const start = /* @__PURE__ */ new Date();
  try {
    await Promise.all([
      extractRuntimeDts("shared"),
      extractRuntimeDts("node"),
      extractRuntimeDts("browser")
    ]);
    logger.writeSuccess("powerlines@build-runtime-types: All runtime type declarations extracted successfully.", {
      logLevel: "all"
    });
  } catch (e) {
    logger.writeError(`powerlines@build-runtime-types: Exception occurred - ${e?.message}`, {
      logLevel: "all"
    });
  } finally {
    const end = /* @__PURE__ */ new Date();
    logger.writeDebug(`powerlines@build-runtime-types: Process took ${end.getTime() - start.getTime()}ms`, {
      logLevel: "all"
    });
    clearTimeout(postinstallTimeout);
    process.exit(0);
  }
})();
process.on("uncaughtException", (e) => {
  logger.writeFatal(`powerlines@build-runtime-types: Uncaught Exception occurred - ${e.message}`, {
    logLevel: "all"
  });
  process.exit(0);
});
process.on("unhandledRejection", (e) => {
  logger.writeFatal(`powerlines@build-runtime-types: Unhandled Rejection occurred - ${e?.message}`, {
    logLevel: "all"
  });
  process.exit(0);
});
