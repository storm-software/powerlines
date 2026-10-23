---
title: Configure @powerlines/plugin-pulumi
description: Options for the pulumi config block.
documentType: concept
---

# Configure @powerlines/plugin-pulumi

Set options on the `pulumi` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  pulumi: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `InlineProgramArgs fields` | `Partial<InlineProgramArgs> (@pulumi/pulumi)` | Pulumi defaults |
| `options` | `LocalWorkspaceOptions` | — |
| `destroy` | `boolean` | — |
| `stackSettings` | `StackSettings` | — |
| `projectSettings` | `Partial<ProjectSettings>` | — |

Options extend `InlineProgramArgs` from `@pulumi/pulumi/automation`. Set `destroy: true` to tear down the stack. See the Pulumi Automation API docs for the full field list. No Powerlines-side defaults are stated in the plugin source.
