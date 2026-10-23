---
title: Run Powerlines commands through Nx
description: Wire an executor into project.json and run a Powerlines command.
documentType: getting-started
---

# Run Powerlines commands through Nx

Each executor runs the matching Powerlines command on the given project. The five executors are `clean`, `prepare`, `lint`, `build`, and `docs`.

## Minimal setup

Add a target to the project's `project.json`. This example wires the `build` executor:

```json
{
  "targets": {
    "build": {
      "executor": "@powerlines/nx:build"
    }
  }
}
```

Run it:

```bash
nx run my-project:build
```

## Result

Nx invokes the `build` Powerlines command for `my-project`. Executor options pass through to the Powerlines command. See [configuration](configuration.md) for the `build` options.

## Notes

- The README states that each executor "should be included in the desired project's `project.json` file." Add one target per command you need.
- The `typescript-sync` generator synchronizes Powerlines projects from the project graph. It is hidden and carries the alias `sync`. Its schema was not inspected beyond `generators.json`. See gaps in [api-reference](api-reference.md).
