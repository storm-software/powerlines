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

import { buildClient } from "@prisma/client-generator-ts";
import { enginesVersion } from "@prisma/engines-version";
import {
  ActiveConnectorType,
  GeneratorConfig,
  GeneratorManifest
} from "@prisma/generator";
import { bufferToString } from "@stryke/convert/buffer-to-string";
import { findFileExtension } from "@stryke/path/find";
import { replaceExtension } from "@stryke/path/replace";
import { isBuffer } from "@stryke/type-checks/is-buffer";
import { isString } from "@stryke/type-checks/is-string";
import { Buffer } from "node:buffer";
import { version as clientVersion } from "../../package.json";
import type { PrismaPluginContext } from "../types/plugin";

interface FileMap {
  [key: string]: string | Buffer | FileMap;
}

export class PowerlinesClientGenerator {
  #options: GeneratorConfig;

  readonly name = "powerlines-client";

  constructor(protected readonly context: PrismaPluginContext) {
    this.#options = {
      name: this.name,
      output: null,
      config: {},
      provider: { fromEnvVar: "POWERLINES_CLIENT_PROVIDER", value: this.name },
      binaryTargets: [],
      previewFeatures: this.context.prisma.previewFeatures,
      sourceFilePath: this.context.prisma.schema.schemaRootDir
    };
  }

  public async getManifest(
    _config: GeneratorConfig
  ): Promise<GeneratorManifest> {
    return Promise.resolve({
      defaultOutput: "./generated",
      prettyName: "Powerlines Client",
      version: clientVersion,
      requiresEngines: [],
      requiresEngineVersion: enginesVersion
    });
  }

  public async generate(): Promise<void> {
    const { prismaClientDmmf, fileMap } = buildClient({
      datamodel: this.context.prisma.schema.schemas
        .map(s => s.content)
        .join("\n"),
      schemaPath: this.context.prisma.schema.schemaPath,
      binaryPaths: {},
      datasources: this.context.prisma.schema.datasources,
      outputDir: this.context.config.prisma.outputPath,
      runtimeBase: "@prisma/client/runtime",
      dmmf: this.context.prisma.dmmf,
      generator: this.#options,
      engineVersion: enginesVersion,
      clientVersion,
      activeProvider: this.context.prisma.schema.primaryDatasource
        ?.activeProvider as ActiveConnectorType,
      typedSql: this.context.prisma.typedSql,
      target: this.context.config.prisma.runtime,
      generatedFileExtension: "ts",
      importFileExtension: "ts",
      moduleFormat: "esm",
      tsNoCheckPreamble: true,
      compilerBuild: "fast"
    });

    const errorArray = [] as Error[];

    const denylists = {
      models: [
        // Reserved Prisma keywords
        "PrismaClient",
        "Prisma",
        // JavaScript keywords
        "async",
        "await",
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "else",
        "enum",
        "export",
        "extends",
        "false",
        "finally",
        "for",
        "function",
        "if",
        "implements",
        "import",
        "in",
        "instanceof",
        "interface",
        "let",
        "new",
        "null",
        "package",
        "private",
        "protected",
        "public",
        "return",
        "super",
        "switch",
        "this",
        "throw",
        "true",
        "try",
        "using",
        "typeof",
        "var",
        "void",
        "while",
        "with",
        "yield"
      ],
      fields: ["AND", "OR", "NOT"],
      dynamic: []
    };

    if (prismaClientDmmf.datamodel.enums) {
      for (const it of prismaClientDmmf.datamodel.enums) {
        if (
          denylists.models.includes(it.name) ||
          denylists.fields.includes(it.name)
        ) {
          errorArray.push(new Error(`"enum ${it.name}"`));
        }
      }
    }

    if (prismaClientDmmf.datamodel.models) {
      for (const it of prismaClientDmmf.datamodel.models) {
        if (
          denylists.models.includes(it.name) ||
          denylists.fields.includes(it.name)
        ) {
          errorArray.push(new Error(`"model ${it.name}"`));
        }
      }
    }

    if (errorArray.length > 0) {
      let message = `Error: The schema at "${
        this.context.prisma.schema.schemaPath
      }" contains reserved keywords.\n       Rename the following items:`;

      for (const error of errorArray) {
        message += `\n         - ${error.message}`;
      }

      throw new Error(
        `${
          message
        }\nTo learn more about how to rename models, check out https://pris.ly/d/naming-models`
      );
    }

    await this.writeFileMap(fileMap);
  }

  public stop() {}

  private async writeFileMap(fileMap: FileMap) {
    return Promise.all(
      Object.entries(fileMap).map(async ([fileName, content]) => {
        if (isString(content)) {
          this.context.emitBuiltinSync(
            content,
            `prisma/${replaceExtension(fileName)}`,
            {
              extension: findFileExtension(fileName) || "ts"
            }
          );
        } else if (isBuffer(content)) {
          this.context.emitBuiltinSync(
            bufferToString(content),
            `prisma/${replaceExtension(fileName)}`,
            {
              extension: findFileExtension(fileName) || "ts"
            }
          );
        } else {
          await this.writeFileMap(content);
        }
      })
    );
  }
}
