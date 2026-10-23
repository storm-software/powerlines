---
title: Configure @powerlines/plugin-jest
description: Options for the test.jest config block.
documentType: concept
---

# Configure @powerlines/plugin-jest

Set options on the `test.jest` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  test.jest: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `codeCoverage` | `boolean` | — |
| `configFile` | `string` | — |
| `detectOpenHandles` | `boolean` | — |
| `logHeapUsage` | `boolean` | — |
| `detectLeaks` | `boolean` | — |
| `testFile` | `string` | — |
| `bail` | `boolean \| number` | — |
| `ci` | `boolean` | — |
| `color` | `boolean` | — |
| `clearCache` | `boolean` | — |
| `findRelatedTests` | `string[]` | — |
| `forceExit` | `boolean` | — |
| `json` | `boolean` | — |
| `maxWorkers` | `number \| string` | — |
| `onlyChanged` | `boolean` | — |
| `changedSince` | `string` | — |
| `outputFile` | `string` | — |
| `passWithNoTests` | `boolean` | — |
| `randomize` | `boolean` | — |
| `runInBand` | `boolean` | — |
| `showConfig` | `boolean` | — |
| `silent` | `boolean` | — |
| `testNamePattern` | `string` | — |
| `testPathIgnorePatterns` | `string[]` | — |
| `testPathPatterns` | `string[]` | — |
| `verbose` | `boolean` | — |
| `coverageReporters` | `string[]` | — |
| `coverageDirectory` | `string` | — |
| `updateSnapshot` | `boolean` | — |
| `watch` | `boolean` | — |
| `watchAll` | `boolean` | — |
| `testTimeout` | `number` | — |

Options mirror Jest CLI flags (`@jest/types` `Config.Argv`). The full flag list is large; the table shows the fields declared in `JestPluginOptions`. See Jest docs for flag behavior. No defaults are stated in the plugin source.
