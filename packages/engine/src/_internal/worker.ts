#!/usr/bin/env -S NODE_OPTIONS=--enable-source-maps node
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

import type {
  BuildInlineConfig,
  CleanInlineConfig,
  DeployInlineConfig,
  DocsInlineConfig,
  ExecutionWorkerParams,
  LintInlineConfig,
  PrepareInlineConfig,
  TestInlineConfig,
  TypesInlineConfig
} from "@powerlines/core";
import { PowerlinesExecution } from "./execution";

export async function clean({
  options,
  config
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.fromConfig(options, config);

  await execution.clean(config as CleanInlineConfig);
  await execution.finalize();
}

export async function prepare({
  options,
  config
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.fromConfig(options, config);

  await execution.prepare(config as PrepareInlineConfig);
  await execution.finalize();
}

export async function types({
  options,
  config
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.fromConfig(options, config);

  await execution.types(config as TypesInlineConfig);
  await execution.finalize();
}

export async function lint({
  options,
  config
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.fromConfig(options, config);

  await execution.lint(config as LintInlineConfig);
  await execution.finalize();
}

export async function test({
  options,
  config
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.fromConfig(options, config);

  await execution.test(config as TestInlineConfig);
  await execution.finalize();
}

export async function build({
  options,
  config
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.fromConfig(options, config);

  await execution.build(config as BuildInlineConfig);
  await execution.finalize();
}

export async function docs({
  options,
  config
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.fromConfig(options, config);

  await execution.docs(config as DocsInlineConfig);
  await execution.finalize();
}

export async function deploy({
  options,
  config
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.fromConfig(options, config);

  await execution.deploy(config as DeployInlineConfig);
  await execution.finalize();
}
