---
title: Install the Powerlines CLI
description: Check prerequisites and add the Powerlines CLI to a project with npm, yarn, pnpm, or bun.
documentType: getting-started
---

# Install the Powerlines CLI

## Prerequisites

Install Node.js version 24.16.0 or later. Install pnpm version 11.9.0 or later. These floors come from the repository root `package.json` `engines` field.

Check your versions:

```bash
node --version
pnpm --version
```

## Add the package

The CLI package name is `@powerlines/cli`. The binary name is `powerlines`. The current source version is `0.47.125`.

> [!NOTE]
> The CLI `package.json` sets `private: true`. The README install lines below come from `packages/devkit/cli/README.md`. Confirm the publish state before you rely on a registry install.

Use one package manager:

```bash
pnpm add @powerlines/cli
```

```bash
npm install @powerlines/cli
```

```bash
yarn add @powerlines/cli
```

## Run without installing

The generated reference docs in `packages/devkit/cli/docs/reference/cli` show this pattern. Use the local binary through your manager:

```bash
npx powerlines --help
```

```bash
pnpm exec powerlines --help
```

```bash
yarn exec powerlines --help
```

```bash
bun x powerlines --help
```

## Verify the install

Run one read-only command. Expect the engine startup line with the version number:

```bash
powerlines --help
```

If the binary is missing, check that `dist/bin.mjs` exists. The `package.json` `bin` field points `powerlines` at `./dist/bin.mjs`. Build the package first with `nx build cli` when `dist/` is absent.

## Next step

Run your first real command in [quick-start](./quick-start.md).
