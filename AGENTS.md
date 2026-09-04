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
