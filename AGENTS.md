<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# External Packages — Do Not Patch

The following packages are maintained in external repositories and must **never** be patched in this workspace:

- `powerlines` (and `@powerlines/*` scoped packages)
- `power-plant` (and `@power-plant/*` scoped packages)
- `shell-shock` (and `@shell-shock/*` scoped packages)
- `razorwind` (and `@razorwind/*` scoped packages)
- `cyclone-ui`
- `storm-ops`

This includes files under `node_modules`, vendored copies, generated artifacts, and any local overrides.

When a fix is needed in one of these packages:

1. **Do not** edit source files belonging to these packages in this repo.
2. **Do** produce a descriptive fix outline that can be applied in the external repository.
3. The outline should include:
   - **Repository** — which external package/repo the change belongs to
   - **Problem** — what is broken or missing, with reproduction steps if applicable
   - **Root cause** — why the issue occurs
   - **Proposed fix** — specific files, functions, or config to change and what to change
   - **Verification** — how to confirm the fix works (tests, commands, or manual checks)
   - **Workarounds** — any temporary mitigations in this repo, if applicable, without patching the external package

If unsure whether a dependency belongs to one of these packages, treat it as external and ask before making changes.
If unsure whether a dependency belongs to one of these packages, treat it as external and ask before making changes.
<!-- storm configuration start-->
 ## External packages — DO NOT PATCH

The following Storm Software ecosystems are maintained in **separate repositories**. Do **not** modify their package code, vendored scaffolding, or `node_modules` contents in this repo — including via `patch-package`, manual edits under `node_modules`, or direct changes to generated integration layers.

| Ecosystem | Upstream repository | In this repo (do not patch) |
| --- | --- | --- |
| **powerlines** | [storm-software/powerlines](https://github.com/storm-software/powerlines) | `powerlines`, `@powerlines/*`, and Powerlines-generated CLI scaffolding |
| **power-plant** | [storm-software/power-plant](https://github.com/storm-software/power-plant) | `@power-plant/*` and any power-plant schema or tooling packages |
| **shell-shock** | [storm-software/shell-shock](https://github.com/storm-software/shell-shock) | `@shell-shock/*` and `apps/cli/.shell-shock/` |
| **mindctl** | [storm-software/mindctl](https://github.com/storm-software/mindctl) | `@mindctl/*` and the mindctl CLI |
| **razorwind** | [storm-software/razorwind](https://github.com/storm-software/razorwind) | `@razorwind/*` |
| **cyclone-ui** | [storm-software/cyclone-ui](https://github.com/storm-software/cyclone-ui) | Consumer configuration and integration owned by this repo (for example `powerlines.config.ts`, `razorwind.config.ts`, `shell-shock.config.ts`, `tools/razorwind/`, and cyclone-ui CLI command implementations under `apps/cli/src/`) |
| **storm-ops** | [storm-software/storm-ops](https://github.com/storm-software/storm-ops) | Reusable workflows, devenv modules, Terraform modules, and other storm-ops artifacts consumed by reference |

**Current repository exception:** You may make changes to files owned by the current repository, even when that repository appears in the table above. The restriction applies only to external packages and vendored layers whose upstream repository is elsewhere.

**Allowed in this repository:** consumer configuration and integration owned by this repo (for example `powerlines.config.ts`, `razorwind.config.ts`, `shell-shock.config.ts`, `tools/razorwind/`, and cyclone-ui CLI command implementations under `apps/cli/src/`).

When a bug or feature belongs in one of the ecosystems above:

1. **Stop** — do not patch the external package or its vendored layer in this repository.
2. **Produce a descriptive upstream fix outline** so a human or agent can apply the change in the correct external repository.
3. **Optionally** implement only this repository's workaround or configuration change if one exists and is explicitly requested.
<!-- storm configuration end-->
