![Powerlines' logo banner](https://public.storm-cdn.com/powerlines/banner-1280x320-dark-optimized.gif)

# Changelog for Powerlines - Powerlines

## [0.30.8](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.30.8) (12/06/2025)

### Bug Fixes

- **powerlines:** Remove `MaybePromise` from `applyToEnvironment` to prevent
  type error
  ([ddc99a85](https://github.com/storm-software/powerlines/commit/ddc99a85))

## [0.30.6](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.30.6) (12/05/2025)

### Miscellaneous

- **powerlines:** Update `applyToEnvironment` to allow returning `PluginConfig`
  ([eae79d5a](https://github.com/storm-software/powerlines/commit/eae79d5a))

## [0.30.3](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.30.3) (12/05/2025)

### Miscellaneous

- **monorepo:** Update the footer banner in `README.md` files
  ([4770e816](https://github.com/storm-software/powerlines/commit/4770e816))
- **monorepo:** Remove all the duplicate banners from `CHANGELOG.md` files
  ([65df7ce4](https://github.com/storm-software/powerlines/commit/65df7ce4))

### Bug Fixes

- **powerlines:** Resolve issue with empty build output directory
  ([f0fa5ca5](https://github.com/storm-software/powerlines/commit/f0fa5ca5))
- **powerlines:** Resolve issue generating `.d.ts` files in `tsdown` build
  ([29c1f9c7](https://github.com/storm-software/powerlines/commit/29c1f9c7))

## [0.30.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.30.2) (12/05/2025)

### Bug Fixes

- **powerlines:** Resolve options resolution issue in `tsdown` build
  ([4d852baf](https://github.com/storm-software/powerlines/commit/4d852baf))

## [0.30.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.30.0) (12/04/2025)

### Miscellaneous

- **monorepo:** Clean up `README.md` files
  ([2f03731b](https://github.com/storm-software/powerlines/commit/2f03731b))
- **monorepo:** Update README banners to include dark/light mode options
  ([c22e58d7](https://github.com/storm-software/powerlines/commit/c22e58d7))
- **monorepo:** Update banner in `README.md` files
  ([27e212f5](https://github.com/storm-software/powerlines/commit/27e212f5))
- **powerlines:** Ensure empty messages are not logged by `rolldown`
  ([4b1bfaf9](https://github.com/storm-software/powerlines/commit/4b1bfaf9))

### Bug Fixes

- **powerlines:** Resolve issue with `dts` options provided to `tsdown` build
  ([4adf62be](https://github.com/storm-software/powerlines/commit/4adf62be))

### Features

- **powerlines:** Rename the `generateTypes` hook to `types`
  ([207c54b8](https://github.com/storm-software/powerlines/commit/207c54b8))

## [0.29.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.29.0) (12/04/2025)

### Miscellaneous

- **powerlines:** Ensure `tsdown` log messages are correctly formatted
  ([28967bd](https://github.com/storm-software/powerlines/commit/28967bd))

### Features

- **plugin-plugin:** Update plugin packages to use `tsdown` builder
  ([b992193](https://github.com/storm-software/powerlines/commit/b992193))
- **powerlines:** Added support for `tsdown` plugin types
  ([cbc2a16](https://github.com/storm-software/powerlines/commit/cbc2a16))

## [0.28.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.28.0) (11/30/2025)

### Features

- **powerlines:** Added `fetch` method to context and improved tsconfig file
  resolver logic
  ([ebb677e](https://github.com/storm-software/powerlines/commit/ebb677e))

## [0.27.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.27.0) (11/28/2025)

### Miscellaneous

- **powerlines:** Consolidate `powerlines/config` exports to `powerlines` module
  ([57312e4](https://github.com/storm-software/powerlines/commit/57312e4))

### Features

- **powerlines:** Updated `resolve` context method to correctly handle build
  options
  ([d25d570](https://github.com/storm-software/powerlines/commit/d25d570))

## [0.26.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.26.2) (11/28/2025)

### Bug Fixes

- **powerlines:** Resolve issue causing overridden build input
  ([3423e19](https://github.com/storm-software/powerlines/commit/3423e19))

## [0.26.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.26.1) (11/27/2025)

### Miscellaneous

- **powerlines:** Ensure `workspaceConfig` is always provided to `tsup` build
  ([dce24e2](https://github.com/storm-software/powerlines/commit/dce24e2))
- **powerlines:** Use custom compiler options for DTS build in `tsup` helper
  ([f742d21](https://github.com/storm-software/powerlines/commit/f742d21))

### Bug Fixes

- **powerlines:** Remove duplicate calls to `writeMetaFile` function
  ([a450883](https://github.com/storm-software/powerlines/commit/a450883))

## [0.26.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.26.0) (11/27/2025)

### Bug Fixes

- **powerlines:** Added `api` to non-hook list of plugin fields
  ([f549b68](https://github.com/storm-software/powerlines/commit/f549b68))

### Features

- **powerlines:** Added `asNextParam` option to allow sequentially invoke hooks
  ([fbbb028](https://github.com/storm-software/powerlines/commit/fbbb028))

## [0.25.4](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.25.4) (11/27/2025)

### Miscellaneous

- **powerlines:** Remove unused `POWERLINES_LOCAL` environment variable
  ([e6dae99](https://github.com/storm-software/powerlines/commit/e6dae99))

## [0.25.3](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.25.3) (11/26/2025)

### Bug Fixes

- **powerlines:** Update typing to support type variance
  ([8bfb28d](https://github.com/storm-software/powerlines/commit/8bfb28d))

## [0.25.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.25.2) (11/26/2025)

### Bug Fixes

- **powerlines:** Remove invariants from `Plugin` type parameters
  ([f72fb6a](https://github.com/storm-software/powerlines/commit/f72fb6a))

## [0.25.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.25.1) (11/25/2025)

### Miscellaneous

- **powerlines:** Increase strictness on `dependsOn` and `dedupe` plugin
  properties
  ([3bb265e](https://github.com/storm-software/powerlines/commit/3bb265e))

## [0.25.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.25.0) (11/25/2025)

### Bug Fixes

- **powerlines:** Ensure `tsconfig` path is properly set in config
  ([b125c73](https://github.com/storm-software/powerlines/commit/b125c73))

### Features

- **powerlines:** Added storage adapters for fine-grained over generated output
  ([64abfc3](https://github.com/storm-software/powerlines/commit/64abfc3))

## [0.24.9](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.24.9) (11/22/2025)

### Miscellaneous

- **powerlines:** Removed excess `tsconfig.json` updates from prepare task
  ([95fcbc2](https://github.com/storm-software/powerlines/commit/95fcbc2))

## [0.24.7](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.24.7) (11/21/2025)

### Bug Fixes

- **powerlines:** Resolve issue preventing VFS disposures and clean up DTS
  generation
  ([ed93dc9](https://github.com/storm-software/powerlines/commit/ed93dc9))

## [0.24.5](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.24.5) (11/21/2025)

### Bug Fixes

- **powerlines:** Update logic for defaulting tsconfig paths
  ([e72a677](https://github.com/storm-software/powerlines/commit/e72a677))

## [0.24.4](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.24.4) (11/21/2025)

### Bug Fixes

- **powerlines:** Resolve issue initializing tsconfig options
  ([1a59471](https://github.com/storm-software/powerlines/commit/1a59471))

## [0.24.3](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.24.3) (11/21/2025)

### Bug Fixes

- **powerlines:** Resolve issue with module path normalizations
  ([503e05a](https://github.com/storm-software/powerlines/commit/503e05a))

## [0.24.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.24.0) (11/21/2025)

### Features

- **powerlines:** Major re-structuring of VFS and added `program` to context
  ([0769e9d](https://github.com/storm-software/powerlines/commit/0769e9d))

## [0.23.10](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.10) (11/21/2025)

### Bug Fixes

- **powerlines:** Fix config file path resolution issue
  ([c201914](https://github.com/storm-software/powerlines/commit/c201914))

## [0.23.9](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.9) (11/20/2025)

### Miscellaneous

- **powerlines:** Clean up `unplugin` entry point and config files
  ([e216e62](https://github.com/storm-software/powerlines/commit/e216e62))

## [0.23.8](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.8) (11/20/2025)

### Bug Fixes

- **powerlines:** Resolve issue with missing context config changes
  ([c1af33f](https://github.com/storm-software/powerlines/commit/c1af33f))
- **powerlines:** Fixed configuration file resolution issues
  ([246a997](https://github.com/storm-software/powerlines/commit/246a997))

## [0.23.7](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.7) (11/20/2025)

### Bug Fixes

- **powerlines:** Resolve issue with unexpected package exports
  ([0ece8cd](https://github.com/storm-software/powerlines/commit/0ece8cd))

## [0.23.6](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.6) (11/20/2025)

### Miscellaneous

- **powerlines:** Clean up unused dependencies and move `memfs` info deps
  ([971c73c](https://github.com/storm-software/powerlines/commit/971c73c))

## [0.23.5](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.5) (11/20/2025)

### Bug Fixes

- **powerlines:** Update `memfs` imports to use correct module path
  ([4b0b487](https://github.com/storm-software/powerlines/commit/4b0b487))

## [0.23.4](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.4) (11/20/2025)

### Miscellaneous

- **powerlines:** Expose `contexts` package exports and reorganize file system
  ([bdb08b0](https://github.com/storm-software/powerlines/commit/bdb08b0))

## [0.23.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.2) (11/19/2025)

### Bug Fixes

- **powerlines:** Resolve issue with order of assets copy post-build
  ([a852bf6](https://github.com/storm-software/powerlines/commit/a852bf6))

## [0.23.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.1) (11/19/2025)

### Miscellaneous

- **powerlines:** Added `outputPath` and `distPath` to `replacePathTokens`
  utility's replacements
  ([80fb71b](https://github.com/storm-software/powerlines/commit/80fb71b))

### Bug Fixes

- **powerlines:** Resolve issue with invalid `rolldown/experimental` import
  ([abbd42e](https://github.com/storm-software/powerlines/commit/abbd42e))

## [0.23.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.23.0) (11/19/2025)

### Features

- **powerlines:** Added the `distPath` output directory option
  ([e76c15c](https://github.com/storm-software/powerlines/commit/e76c15c))

## [0.22.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.22.1) (11/19/2025)

### Miscellaneous

- **powerlines:** Added the `getWorkspaceName` helper function
  ([8909fd0](https://github.com/storm-software/powerlines/commit/8909fd0))

## [0.22.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.22.0) (11/18/2025)

### Features

- **powerlines:** Added the `getOrganizationName` utility and `context-helpers`
  module
  ([40a5fd0](https://github.com/storm-software/powerlines/commit/40a5fd0))

## [0.21.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.21.0) (11/18/2025)

### Miscellaneous

- **powerlines:** Renamed `release` command to `deploy`
  ([10197a8](https://github.com/storm-software/powerlines/commit/10197a8))
- **powerlines:** Remove unused function from `UnifiedFS` class
  ([25bfb8d](https://github.com/storm-software/powerlines/commit/25bfb8d))
- **powerlines:** Update `vfs` to load file data from a cache buffer
  ([7f17a66](https://github.com/storm-software/powerlines/commit/7f17a66))
- **powerlines:** Expanded the `alias` build option and improved plugin utility
  helpers
  ([7e468d3](https://github.com/storm-software/powerlines/commit/7e468d3))

### Bug Fixes

- **powerlines:** Resolve issue with removing pre-existing `fs.bin` buffer files
  ([6141aa0](https://github.com/storm-software/powerlines/commit/6141aa0))

### Features

- **powerlines:** Added the `polyfill` build option
  ([993218c](https://github.com/storm-software/powerlines/commit/993218c))

## [0.20.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.20.0) (11/17/2025)

### Features

- **powerlines:** Added `UnresolvedContext` and other type improvements for
  accuracy
  ([da156cb](https://github.com/storm-software/powerlines/commit/da156cb))

## [0.19.4](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.19.4) (11/16/2025)

### Miscellaneous

- **powerlines:** Added a Cap'n Proto schema for file system storage
  ([012891d](https://github.com/storm-software/powerlines/commit/012891d))

## [0.19.3](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.19.3) (11/12/2025)

### Miscellaneous

- **powerlines:** Reduce type strictness on `defineConfig` parameter
  ([ef031db](https://github.com/storm-software/powerlines/commit/ef031db))

## [0.19.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.19.2) (11/08/2025)

### Bug Fixes

- **powerlines:** Resolve issue applying `filter` to plugin hooks
  ([38701ee](https://github.com/storm-software/powerlines/commit/38701ee))

## [0.19.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.19.1) (11/08/2025)

### Bug Fixes

- **powerlines:** Resolved issue with nested ouput path on `entry` values
  ([b95bba9](https://github.com/storm-software/powerlines/commit/b95bba9))

## [0.19.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.19.0) (11/08/2025)

### Features

- **powerlines:** Added log helper functions to `Context` object
  ([6189d68](https://github.com/storm-software/powerlines/commit/6189d68))

## [0.18.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.18.0) (11/07/2025)

### Features

- **powerlines:** Added the `enforceVariant` helper utility
  ([cd90565](https://github.com/storm-software/powerlines/commit/cd90565))

## [0.17.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.17.0) (11/07/2025)

### Miscellaneous

- **powerlines:** Resolve TypeScript linting issue
  ([bb727a8](https://github.com/storm-software/powerlines/commit/bb727a8))

### Features

- **powerlines:** Added the `extend` and `merge` plugin helpers
  ([9cc1ec9](https://github.com/storm-software/powerlines/commit/9cc1ec9))

## [0.16.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.16.0) (11/05/2025)

### Features

- **powerlines:** Added the `replacePathTokens` helper utility
  ([659fc2a](https://github.com/storm-software/powerlines/commit/659fc2a))

## [0.15.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.15.0) (11/05/2025)

### Miscellaneous

- **powerlines:** Move helpers into the `plugin-utils` module
  ([a235978](https://github.com/storm-software/powerlines/commit/a235978))
- **powerlines:** Update resolving logic to use `framework` to determine
  `configFile` path
  ([749901b](https://github.com/storm-software/powerlines/commit/749901b))

### Features

- **powerlines:** Added the `generateTypes` plugin hook
  ([20a2879](https://github.com/storm-software/powerlines/commit/20a2879))
- **powerlines:** Added the `plugin-utils` export module
  ([6e3144b](https://github.com/storm-software/powerlines/commit/6e3144b))

## [0.14.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.14.1) (2025-10-28)

### Miscellaneous

- **powerlines:** Update the string casing in the example
  ([d0ab6cf](https://github.com/storm-software/powerlines/commit/d0ab6cf))

## [0.14.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.14.0) (2025-10-27)

### Features

- **powerlines:** Added the `resolve` helper utility function
  ([c0f5197](https://github.com/storm-software/powerlines/commit/c0f5197))

## [0.13.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.13.0) (2025-10-25)

### Features

- **plugin-biome:** Initial check-in of the `biome` plugin
  ([f21f10d](https://github.com/storm-software/powerlines/commit/f21f10d))

## [0.12.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.12.0) (2025-10-25)

### Features

- **plugin-jest:** Initial check-in of `jest` plugin
  ([902f57f](https://github.com/storm-software/powerlines/commit/902f57f))

## [0.11.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.11.0) (2025-10-25)

### Features

- **powerlines:** Added the `createProgram` helper function
  ([98b9323](https://github.com/storm-software/powerlines/commit/98b9323))

### Miscellaneous

- **powerlines:** Resolve linting errors
  ([cb9da73](https://github.com/storm-software/powerlines/commit/cb9da73))

## [0.10.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.10.2) (2025-10-24)

### Bug Fixes

- **deepkit:** Resolve issues with `scripts` build
  ([2605653](https://github.com/storm-software/powerlines/commit/2605653))

## [0.10.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.10.1) (2025-10-24)

### Source Code Improvements

- **powerlines:** Large scale improvements to the `vfs` module
  ([8d1de0f](https://github.com/storm-software/powerlines/commit/8d1de0f))

## [0.10.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.10.0) (2025-10-24)

### Features

- **plugin-tsc:** Added the `typeCheck` configuration option
  ([3ec4780](https://github.com/storm-software/powerlines/commit/3ec4780))

### Miscellaneous

- **powerlines:** Added `parse` function cache to `Context` class
  ([7f90532](https://github.com/storm-software/powerlines/commit/7f90532))

## [0.9.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.9.0) (2025-10-24)

### Features

- **powerlines:** Added `parse` function to `context` objects
  ([5a56c5c](https://github.com/storm-software/powerlines/commit/5a56c5c))

## [0.8.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.8.0) (2025-10-24)

### Features

- **deepkit:** Initial check-in of the `deepkit` package
  ([d3372b8](https://github.com/storm-software/powerlines/commit/d3372b8))

## [0.7.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.7.1) (2025-10-23)

### Miscellaneous

- **monorepo:** Remove `tsdoc` package to make repo less opinionated
  ([1a07423](https://github.com/storm-software/powerlines/commit/1a07423))

## [0.7.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.7.0) (2025-10-23)

### Features

- **powerlines:** Added the `extendPlugin` helper function
  ([4cd8b1e](https://github.com/storm-software/powerlines/commit/4cd8b1e))

## [0.6.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.6.1) (2025-10-22)

### Miscellaneous

- **monorepo:** Reformat repository files and resolve lefthook issue
  ([7b25a63](https://github.com/storm-software/powerlines/commit/7b25a63))

## [0.6.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.6.0) (2025-10-22)

### Features

- **plugin-rspack:** Initial check-in of `rspack` plugin
  ([64a8925](https://github.com/storm-software/powerlines/commit/64a8925))
- **plugin-webpack:** Initial check-in of the `webpack` plugin
  ([d8efe57](https://github.com/storm-software/powerlines/commit/d8efe57))

### Bug Fixes

- **powerlines:** Resolved issue in `rspack` config
  ([d4dbb0c](https://github.com/storm-software/powerlines/commit/d4dbb0c))

## [0.5.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.5.0) (2025-10-21)

### Features

- **plugin-plugin:** Merge in all required plugin functionality
  ([8ed6862](https://github.com/storm-software/powerlines/commit/8ed6862))
- **plugin-eslint:** Initial check-in of the `eslint` plugin
  ([8551a38](https://github.com/storm-software/powerlines/commit/8551a38))

### Miscellaneous

- **powerlines:** Clean up dependency installation code
  ([a5a46d8](https://github.com/storm-software/powerlines/commit/a5a46d8))
- **powerlines:** Remove old unused eslint module
  ([63ea901](https://github.com/storm-software/powerlines/commit/63ea901))

## [0.4.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.4.0) (2025-10-21)

### Features

- **powerlines:** Added separate `devDependencies` node on contexts
  ([c6f1fab](https://github.com/storm-software/powerlines/commit/c6f1fab))

## [0.3.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.3.0) (2025-10-21)

### Features

- **powerlines:** Added `framework` option to configuration
  ([f6754a6](https://github.com/storm-software/powerlines/commit/f6754a6))

### Miscellaneous

- **powerlines:** Exposed additional `deepkit` modules in vendored code
  ([60b433a](https://github.com/storm-software/powerlines/commit/60b433a))

## [0.2.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.2.0) (2025-10-21)

### Features

- **plugin-typedoc:** Initial check-in of the TypeDoc plugin
  ([d1e966b](https://github.com/storm-software/powerlines/commit/d1e966b))
- **powerlines:** Added `builtinPrefix` and `runtimeFolder` output options
  ([04e3e68](https://github.com/storm-software/powerlines/commit/04e3e68))

## [0.1.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.1.1) (2025-10-20)

### Miscellaneous

- **powerlines:** Minor package clean up
  ([f0539ca](https://github.com/storm-software/powerlines/commit/f0539ca))
