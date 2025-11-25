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

import { SchemaCreator } from "prisma-util/schema-creator";
import { PrismaPluginContext } from "../types/plugin";
import { GeneratorConfig } from "../types/prisma";

/**
 * Prisma schema creator that allows building a schema via code.
 */
export class PrismaSchemaCreator extends SchemaCreator {
  /** Prisma plugin context */
  #context: PrismaPluginContext;

  private get generators(): GeneratorConfig[] {
    return this.#context.prisma.schema.generators;
  }

  private set generators(value: GeneratorConfig[]) {
    this.#context.prisma.schema.generators = value;
  }

  public constructor(context: PrismaPluginContext) {
    super();

    this.#context = context;
    this.#context.prisma ??= {} as PrismaPluginContext["prisma"];
    this.#context.prisma.schema ??= {
      generators: [],
      datasources: [],
      warnings: []
    };

    this.#context.prisma.schema.generators.forEach(generator => {
      this.pushGenerator(generator);
    });
  }

  public pushGenerator(generator: GeneratorConfig): this {
    if (this.generators.some(gen => gen.name === generator.name)) {
      this.generators = [
        ...this.generators.filter(gen => gen.name !== generator.name),
        generator
      ];
    } else {
      this.generators.push(generator);
    }

    return this;
  }

  public override build(): string {
    let schema = super.build();

    for (const generator of this.generators) {
      schema = `
generator ${generator.name} {
  provider = "${generator.provider.value}"
  output = "${generator.output?.value}"${
    generator.previewFeatures && generator.previewFeatures.length > 0
      ? `
  previewFeatures = [${generator.previewFeatures
    .map(feature => `"${feature}"`)
    .join(", ")}]`
      : ""
  }${
    generator.config && Object.keys(generator.config).length > 0
      ? Object.entries(generator.config)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key} = [${value.map(v => `"${v}"`).join(", ")}]`;
            } else {
              return `${key} = "${value}"`;
            }
          })
          .join("\n  ")
      : ""
  }${
    generator.binaryTargets && generator.binaryTargets.length > 0
      ? `
  binaryTargets = [${generator.binaryTargets
    .map(bt => `"${bt.value}"`)
    .join(", ")}]`
      : ""
  }${
    generator.envPaths?.rootEnvPath || generator.envPaths?.schemaEnvPath
      ? `
  env = {${
    generator.envPaths?.rootEnvPath
      ? `
    root = "${generator.envPaths.rootEnvPath}"`
      : ""
  }${
    generator.envPaths?.schemaEnvPath
      ? `
    schema = "${generator.envPaths.schemaEnvPath}"`
      : ""
  }
  }`
      : ""
  }
}

${schema}`;
    }

    return schema;
  }

  public async write(): Promise<void> {
    await this.#context.fs.write(
      this.#context.config.prisma.schema,
      this.build()
    );
  }
}
