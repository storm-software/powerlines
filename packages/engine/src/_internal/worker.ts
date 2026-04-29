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
  initialConfig,
  inlineConfig
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.init(options, initialConfig);

  await execution.clean(inlineConfig as CleanInlineConfig);
}

export async function prepare({
  options,
  initialConfig,
  inlineConfig
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.init(options, initialConfig);

  await execution.prepare(inlineConfig as PrepareInlineConfig);
}

export async function types({
  options,
  initialConfig,
  inlineConfig
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.init(options, initialConfig);

  await execution.types(inlineConfig as TypesInlineConfig);
}

export async function lint({
  options,
  initialConfig,
  inlineConfig
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.init(options, initialConfig);

  await execution.lint(inlineConfig as LintInlineConfig);
}

export async function test({
  options,
  initialConfig,
  inlineConfig
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.init(options, initialConfig);

  await execution.test(inlineConfig as TestInlineConfig);
}

export async function build({
  options,
  initialConfig,
  inlineConfig
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.init(options, initialConfig);

  await execution.build(inlineConfig as BuildInlineConfig);
}

export async function docs({
  options,
  initialConfig,
  inlineConfig
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.init(options, initialConfig);

  await execution.docs(inlineConfig as DocsInlineConfig);
}

export async function deploy({
  options,
  initialConfig,
  inlineConfig
}: ExecutionWorkerParams): Promise<void> {
  const execution = await PowerlinesExecution.init(options, initialConfig);

  await execution.deploy(inlineConfig as DeployInlineConfig);
}
