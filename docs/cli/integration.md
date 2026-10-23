---
title: Integrate the Powerlines CLI
description: Use Powerlines with Node.js, pnpm, Nx, and shell completions in larger workflows.
documentType: concept
---

# Integration

## Supported runtimes

Run the CLI on Node.js 24.16.0 or later with pnpm 11.9.0 or later. These floors come from the repository root `package.json`. No browser, OS, or module-format matrix appears in the CLI source.

Invoke through any manager shown in the generated reference docs:

```bash
npx powerlines build --root <project-dir>
```

```bash
pnpm exec powerlines build --root <project-dir>
```

```bash
yarn exec powerlines build --root <project-dir>
```

```bash
bun x powerlines build --root <project-dir>
```

## Nx workspace

The CLI README documents Nx targets for contributors:

```bash
nx build cli
```

```bash
nx test cli
```

```bash
nx lint cli
```

Use `nx build cli` to produce `dist/bin.mjs` before running the binary from source. See [troubleshooting](./troubleshooting.md) when `dist/` is missing.

## Shell completions

The CLI `package.json` `exports` map exposes completion entries for four shells: `completions-bash-config`, `completions-bash-script`, `completions-fish-config`, `completions-fish-script`, `completions-powershell-config`, `completions-powershell-script`, `completions-zsh-config`, and `completions-zsh-script`. Generated markdown stubs exist under `packages/devkit/cli/docs/reference/cli/completions/`. No install steps appear in the CLI source, so follow the generated stub for your shell.

## Engine relationship

The CLI is a thin wrapper. `packages/devkit/cli/src/utilities/create-powerlines.ts` calls `createEngine` from `powerlines/engine`. Each command then calls one engine method. Teams that embed Powerlines in code should read that utility and the `powerlines` package directly. This doc set covers the CLI surface only.

## Gaps (not in CLI source)

- No peer-dependency or version-compatibility matrix beyond the Node.js and pnpm floors.
- No migration or breaking-change notes in the CLI source.
- No CI, release, or deployment pipeline owned by the CLI package.
