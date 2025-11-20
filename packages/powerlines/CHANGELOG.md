![Storm Software's logo banner](https://public.storm-cdn.com/brand-banner.png)

# Changelog for Powerlines - Powerlines

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
