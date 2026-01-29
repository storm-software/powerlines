![Powerlines' logo banner](https://public.storm-cdn.com/powerlines/banner-1280x320-dark.gif)

# Changelog for Powerlines - Powerlines

## [0.38.17](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.38.17) (01/29/2026)

### Miscellaneous

- **powerlines:** Update internal module to have an underscore prefix ([70625d5a](https://github.com/storm-software/powerlines/commit/70625d5a))

## [0.38.6](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.38.6) (01/27/2026)

### Miscellaneous

- **powerlines:** Remove excessive `tsdown` default configuration values ([87e46ac6](https://github.com/storm-software/powerlines/commit/87e46ac6))

## [0.38.4](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.38.4) (01/27/2026)

### Miscellaneous

- **powerlines:** Remove unneeded logic to add star exports ([5de17410](https://github.com/storm-software/powerlines/commit/5de17410))

## [0.38.3](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.38.3) (01/27/2026)

### Bug Fixes

- **plugin-alloy:** Remove unneeded bundling logic ([925772fa](https://github.com/storm-software/powerlines/commit/925772fa))

## [0.38.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.38.1) (01/27/2026)

### Bug Fixes

- **powerlines:** Resolve issue with `exports` by adding `customExports`
  function
  ([b8025ec8](https://github.com/storm-software/powerlines/commit/b8025ec8))

## [0.38.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.38.0) (01/27/2026)

### Bug Fixes

- **powerlines:** Resolve issue with invalid `exports` build configuration
  ([b3e77d11](https://github.com/storm-software/powerlines/commit/b3e77d11))
- **powerlines:** Resolve issue with invalid `platform` configuration defaulting
  ([35157af4](https://github.com/storm-software/powerlines/commit/35157af4))

### Features

- **powerlines:** Added the `getDependencyConfig` build config helper utility
  ([44105eef](https://github.com/storm-software/powerlines/commit/44105eef))

## [0.37.101](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.101) (01/26/2026)

### Bug Fixes

- **powerlines:** Resolve issue when items from `external` exists in
  `noExternal` option
  ([6e39973d](https://github.com/storm-software/powerlines/commit/6e39973d))

## [0.37.92](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.92) (01/24/2026)

### Bug Fixes

- **powerlines:** Remove unused `@vue/reactivity` patch and old built-in module
  transformations
  ([fce0b19a](https://github.com/storm-software/powerlines/commit/fce0b19a))

## [0.37.89](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.89) (01/23/2026)

### Miscellaneous

- **powerlines:** Improve the `rolldown` and `tsdown` build options extraction
  logic
  ([bd026643](https://github.com/storm-software/powerlines/commit/bd026643))

### Bug Fixes

- **powerlines:** Resolve issue with invalid `tsdown` build options
  ([d4b86951](https://github.com/storm-software/powerlines/commit/d4b86951))

## [0.37.87](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.87) (01/23/2026)

### Bug Fixes

- **powerlines:** Resolve issue with relative path comparisons in `format`
  function
  ([1e28545e](https://github.com/storm-software/powerlines/commit/1e28545e))

## [0.37.85](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.85) (01/23/2026)

### Miscellaneous

- **powerlines:** Added `force` parameter to `format` utility
  ([fc5bc135](https://github.com/storm-software/powerlines/commit/fc5bc135))
- **powerlines:** Enhance formatting logic to ignore `outputPath` and
  `buildPath`
  ([b141ee6a](https://github.com/storm-software/powerlines/commit/b141ee6a))

## [0.37.84](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.84) (01/23/2026)

### Miscellaneous

- **powerlines:** Improved VFS formatting logging
  ([0423e247](https://github.com/storm-software/powerlines/commit/0423e247))

## [0.37.83](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.83) (01/23/2026)

### Miscellaneous

- **powerlines:** Remove unsued `program` from context
  ([6a03bdfd](https://github.com/storm-software/powerlines/commit/6a03bdfd))

## [0.37.82](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.82) (01/23/2026)

### Miscellaneous

- **powerlines:** Convert import statements to directives in dts file
  ([a2f7f7ba](https://github.com/storm-software/powerlines/commit/a2f7f7ba))

### Bug Fixes

- **powerlines:** Resolve typescript typing issues
  ([43c10eb5](https://github.com/storm-software/powerlines/commit/43c10eb5))

## [0.37.81](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.81) (01/23/2026)

### Miscellaneous

- **powerlines:** Format generated entry files prior to running `build` step
  ([8fa564fe](https://github.com/storm-software/powerlines/commit/8fa564fe))

## [0.37.79](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.79) (01/22/2026)

### Miscellaneous

- **powerlines:** Added better `unplugin` logging and name specification
  ([061b238a](https://github.com/storm-software/powerlines/commit/061b238a))

## [0.37.78](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.78) (01/22/2026)

### Bug Fixes

- **powerlines:** Ensure the `bundle` function only uses resolver plugin hooks
  ([91bb662f](https://github.com/storm-software/powerlines/commit/91bb662f))

## [0.37.77](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.77) (01/22/2026)

### Miscellaneous

- **powerlines:** Include `bundle` as `packages` option in `bundle` helper
  utility
  ([8a7290b6](https://github.com/storm-software/powerlines/commit/8a7290b6))

## [0.37.76](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.76) (01/22/2026)

### Bug Fixes

- **powerlines:** Update `bundle` to use full `unplugin` plugin
  ([f2db6951](https://github.com/storm-software/powerlines/commit/f2db6951))

## [0.37.75](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.75) (01/22/2026)

### Bug Fixes

- **powerlines:** Resolve issue with invalid options passed to `onLoad` result
  ([4f795d19](https://github.com/storm-software/powerlines/commit/4f795d19))

## [0.37.74](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.74) (01/22/2026)

### Miscellaneous

- **powerlines:** Clean up error messages in `resolve` helper function
  ([faf3fd2f](https://github.com/storm-software/powerlines/commit/faf3fd2f))

## [0.37.73](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.73) (01/21/2026)

### Miscellaneous

- **powerlines:** Update `bundle` function to use a custom plugin to resolve
  built-ins
  ([3787bbd0](https://github.com/storm-software/powerlines/commit/3787bbd0))
- **powerlines:** Update most `trace` logs to `debug` to consolidate messages
  ([8fa1def7](https://github.com/storm-software/powerlines/commit/8fa1def7))

## [0.37.72](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.72) (01/21/2026)

### Miscellaneous

- **powerlines:** Removed `builtinPrefix` to simplify context usage
  ([f49ee720](https://github.com/storm-software/powerlines/commit/f49ee720))

### Bug Fixes

- **powerlines:** Resolve early access to `config.build` in `init` function
  ([f6fb2e30](https://github.com/storm-software/powerlines/commit/f6fb2e30))
- **powerlines:** Resolve issue using builtins inside code provided to `bundle`
  function
  ([5b57a3e6](https://github.com/storm-software/powerlines/commit/5b57a3e6))

## [0.37.67](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.67) (01/21/2026)

### Bug Fixes

- **powerlines:** Resolve issue with RegExp string generation logic
  ([7bb94cfe](https://github.com/storm-software/powerlines/commit/7bb94cfe))

## [0.37.66](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.66) (01/21/2026)

### Bug Fixes

- **powerlines:** Resolve issue with generated module comment regex
  ([b132c8d2](https://github.com/storm-software/powerlines/commit/b132c8d2))

## [0.37.65](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.65) (01/20/2026)

### Bug Fixes

- **powerlines:** Resolve issue organizing multi-comment built-in files
  ([6a11e822](https://github.com/storm-software/powerlines/commit/6a11e822))

## [0.37.64](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.64) (01/20/2026)

### Bug Fixes

- **powerlines:** Resolve issue with invalid Regex for selecting module comments
  ([22ba6126](https://github.com/storm-software/powerlines/commit/22ba6126))

## [0.37.63](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.63) (01/20/2026)

### Miscellaneous

- **powerlines:** Clean up module comments and extensions in dts file generation
  ([d6b4cbf5](https://github.com/storm-software/powerlines/commit/d6b4cbf5))

## [0.37.62](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.62) (01/20/2026)

### Bug Fixes

- **powerlines:** Resolve issue with invalid `outDir` option provided to tsc
  ([656ba886](https://github.com/storm-software/powerlines/commit/656ba886))

## [0.37.61](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.61) (01/20/2026)

### Bug Fixes

- **powerlines:** Resolve issue with dts files output paths
  ([07402431](https://github.com/storm-software/powerlines/commit/07402431))

## [0.37.60](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.60) (01/20/2026)

### Bug Fixes

- **powerlines:** Ensure "./" prefix is applied to built-in import paths
  ([68170ec9](https://github.com/storm-software/powerlines/commit/68170ec9))

## [0.37.59](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.59) (01/20/2026)

### Bug Fixes

- **powerlines:** Resolve issue with relative path for built-in module imports
  ([73bc135f](https://github.com/storm-software/powerlines/commit/73bc135f))

## [0.37.58](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.58) (01/20/2026)

### Miscellaneous

- **powerlines:** Ensure the updated built-in module paths are relative
  ([3e7cd297](https://github.com/storm-software/powerlines/commit/3e7cd297))

### Bug Fixes

- **powerlines:** Resolve issue applying built-in module aliases
  ([cca3e91b](https://github.com/storm-software/powerlines/commit/cca3e91b))

## [0.37.57](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.57) (01/20/2026)

### Bug Fixes

- **powerlines:** Resolve built-in file import transformation logic's selection
  issue
  ([9c43c7e5](https://github.com/storm-software/powerlines/commit/9c43c7e5))

## [0.37.56](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.56) (01/20/2026)

### Bug Fixes

- **powerlines:** Resolve issue with invalid built-in file transformations
  ([c4a4fc39](https://github.com/storm-software/powerlines/commit/c4a4fc39))

## [0.37.55](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.55) (01/20/2026)

### Bug Fixes

- **powerlines:** Resolve issue with single file entry points
  ([bebf5a8b](https://github.com/storm-software/powerlines/commit/bebf5a8b))

## [0.37.54](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.54) (01/20/2026)

### Miscellaneous

- **powerlines:** Resolve issue with `isFile` result in `fs` VFS adapter
  ([2da97461](https://github.com/storm-software/powerlines/commit/2da97461))

## [0.37.53](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.53) (01/19/2026)

### Bug Fixes

- **powerlines:** Resolve issue with invalid paths provided in `getBuiltin`
  functions
  ([ded49672](https://github.com/storm-software/powerlines/commit/ded49672))

## [0.37.52](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.52) (01/19/2026)

### Bug Fixes

- **powerlines:** Resolve issue providing builtin files' paths to type
  declaration
  ([8daf73cf](https://github.com/storm-software/powerlines/commit/8daf73cf))

## [0.37.51](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.51) (01/19/2026)

### Bug Fixes

- **powerlines:** Resolve build issue with missing import type
  ([5efb756a](https://github.com/storm-software/powerlines/commit/5efb756a))
- **powerlines:** Resolve issue with invalid entry point path changes
  ([22aaf246](https://github.com/storm-software/powerlines/commit/22aaf246))

## [0.37.50](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.50) (01/19/2026)

### Bug Fixes

- **powerlines:** Resolved issue with invalid name in `file` property in
  `_entry` property
  ([96749d7c](https://github.com/storm-software/powerlines/commit/96749d7c))

## [0.37.49](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.49) (01/18/2026)

### Bug Fixes

- **powerlines:** Resolve issue with missing extensions on file paths
  ([25107b42](https://github.com/storm-software/powerlines/commit/25107b42))

## [0.37.48](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.48) (01/18/2026)

### Bug Fixes

- **powerlines:** Resolve issue with entry path resolution code
  ([439b75a3](https://github.com/storm-software/powerlines/commit/439b75a3))

## [0.37.47](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.47) (01/18/2026)

### Bug Fixes

- **powerlines:** Resolve issue setting entry point paths in `emitEntry`
  functions
  ([50638dd8](https://github.com/storm-software/powerlines/commit/50638dd8))

## [0.37.46](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.46) (01/16/2026)

### Bug Fixes

- **powerlines:** Resolve issue converting glob patterns to regex in VFS
  ([3044a3ef](https://github.com/storm-software/powerlines/commit/3044a3ef))

## [0.37.45](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.45) (01/16/2026)

### Miscellaneous

- **powerlines:** Removed duplicate items from configuration logging
  ([b8c86063](https://github.com/storm-software/powerlines/commit/b8c86063))

### Bug Fixes

- **powerlines:** Resolve issue preventing selection of files directly in
  `entry` directories
  ([69a291d3](https://github.com/storm-software/powerlines/commit/69a291d3))
- **powerlines:** Ensure undefined objects cannot cause issues when logging
  config
  ([9965295f](https://github.com/storm-software/powerlines/commit/9965295f))
- **powerlines:** Resolve issue checking globbed pattern in VFS lists
  ([bfafd76c](https://github.com/storm-software/powerlines/commit/bfafd76c))

## [0.37.44](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.44) (01/16/2026)

### Bug Fixes

- **powerlines:** Resolve issue finding glob entrypoint files
  ([c8bb1091](https://github.com/storm-software/powerlines/commit/c8bb1091))

## [0.37.43](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.43) (01/15/2026)

### Bug Fixes

- **powerlines:** Resolve issue with setting `dts` to boolean value
  ([247d70f7](https://github.com/storm-software/powerlines/commit/247d70f7))

## [0.37.39](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.39) (01/15/2026)

### Bug Fixes

- **powerlines:** Resolve issue populating `entry` paths
  ([f5e0fc68](https://github.com/storm-software/powerlines/commit/f5e0fc68))

## [0.37.37](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.37) (01/15/2026)

### Bug Fixes

- **powerlines:** Resolve issue causing failures while generating dts files
  ([5fd0a3f0](https://github.com/storm-software/powerlines/commit/5fd0a3f0))

## [0.37.36](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.36) (01/15/2026)

### Miscellaneous

- **powerlines:** Update `resolveEntries` function signature to be consistent
  ([9bfbcb50](https://github.com/storm-software/powerlines/commit/9bfbcb50))

### Bug Fixes

- **powerlines:** Resolve issue with invalid import module
  ([ea09f50f](https://github.com/storm-software/powerlines/commit/ea09f50f))

## [0.37.35](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.35) (01/15/2026)

### Miscellaneous

- **powerlines:** Update entry resolver logic to use VFS for listing files
  ([a5956593](https://github.com/storm-software/powerlines/commit/a5956593))
- **powerlines:** Renamed `skipInstalls` configuration to `autoInstall`
  ([c8e34b03](https://github.com/storm-software/powerlines/commit/c8e34b03))

### Bug Fixes

- **powerlines:** Resolve issue emitting types for built-in modules
  ([4f4fd571](https://github.com/storm-software/powerlines/commit/4f4fd571))

## [0.37.34](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.34) (01/15/2026)

### Miscellaneous

- **powerlines:** Clean up log level consistency in API module
  ([1dab3b34](https://github.com/storm-software/powerlines/commit/1dab3b34))

### Bug Fixes

- **powerlines:** Ensure the `tsdown` builder uses correctly formatted entry
  points
  ([58cd01f4](https://github.com/storm-software/powerlines/commit/58cd01f4))

## [0.37.33](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.33) (01/15/2026)

### Miscellaneous

- **powerlines:** Clean up `rolldown` and `tsdown` build logging
  ([f46a9516](https://github.com/storm-software/powerlines/commit/f46a9516))

### Bug Fixes

- **powerlines:** Resolve issue with incorrect usage of VFS's `ids` property
  ([c8094089](https://github.com/storm-software/powerlines/commit/c8094089))

## [0.37.32](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.32) (01/15/2026)

### Miscellaneous

- **powerlines:** Clean up logging in powerlines API module
  ([99032363](https://github.com/storm-software/powerlines/commit/99032363))

### Bug Fixes

- **powerlines:** Resolve stale entrypoint usage issue
  ([9019ea76](https://github.com/storm-software/powerlines/commit/9019ea76))

## [0.37.31](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.31) (01/14/2026)

### Miscellaneous

- **powerlines:** Improve logic in VFS `read` methods to handle missing files
  ([e470d083](https://github.com/storm-software/powerlines/commit/e470d083))

## [0.37.30](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.30) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve issue converting `BitInt` to `number` in `dispose`
  method
  ([15a4132c](https://github.com/storm-software/powerlines/commit/15a4132c))

## [0.37.29](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.29) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve error with duplicate metadata keys in VFS module
  ([96e3c2f8](https://github.com/storm-software/powerlines/commit/96e3c2f8))

## [0.37.28](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.28) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve issue reading paths in `dispose` method
  ([046bbde7](https://github.com/storm-software/powerlines/commit/046bbde7))

## [0.37.27](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.27) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve issue with redeclared VFS instance in `create`
  function
  ([a4ea5b22](https://github.com/storm-software/powerlines/commit/a4ea5b22))

## [0.37.26](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.26) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve issue initializing VFS metadata
  ([52f9a846](https://github.com/storm-software/powerlines/commit/52f9a846))

## [0.37.25](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.25) (01/14/2026)

### Bug Fixes

- **powerlines:** Update the VFS to handle metadata property listing correctly
  ([75b7c1f2](https://github.com/storm-software/powerlines/commit/75b7c1f2))

## [0.37.24](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.24) (01/14/2026)

### Miscellaneous

- **powerlines:** Ensure file details from storage are preserved during loading
  ([91c74ff5](https://github.com/storm-software/powerlines/commit/91c74ff5))

## [0.37.23](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.23) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve issue disposing VFS module
  ([cbd6f11f](https://github.com/storm-software/powerlines/commit/cbd6f11f))

## [0.37.22](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.22) (01/14/2026)

### Miscellaneous

- **powerlines:** Cleaned up logic around VFS initialization
  ([d5143ec0](https://github.com/storm-software/powerlines/commit/d5143ec0))

## [0.37.21](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.21) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve issue preventing entrypoints from being loaded from
  cache initialization
  ([4748fbe3](https://github.com/storm-software/powerlines/commit/4748fbe3))

## [0.37.20](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.20) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve issue accessing internal entry objects
  ([dcbeb22b](https://github.com/storm-software/powerlines/commit/dcbeb22b))

## [0.37.19](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.19) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve issue populating internal entrypoint field
  ([5b1490b0](https://github.com/storm-software/powerlines/commit/5b1490b0))

## [0.37.18](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.18) (01/14/2026)

### Bug Fixes

- **powerlines:** Resolve issues with applying entry points
  ([51248795](https://github.com/storm-software/powerlines/commit/51248795))

## [0.37.16](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.16) (01/08/2026)

### Miscellaneous

- **powerlines:** Added logic to format generated source code
  ([7cc91902](https://github.com/storm-software/powerlines/commit/7cc91902))

## [0.37.14](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.14) (01/07/2026)

### Bug Fixes

- **powerlines:** Update artifacts paths to account for `projectRoot`
  configuration
  ([68eaeabc](https://github.com/storm-software/powerlines/commit/68eaeabc))

## [0.37.12](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.12) (01/07/2026)

### Bug Fixes

- **plugin-alloy:** Resolve file path issue during builtin module rendering
  ([805f4f0e](https://github.com/storm-software/powerlines/commit/805f4f0e))

## [0.37.11](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.11) (01/07/2026)

### Miscellaneous

- **powerlines:** Added the `environments` constant module to exported libs
  ([861217f8](https://github.com/storm-software/powerlines/commit/861217f8))

## [0.37.10](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.10) (01/07/2026)

### Miscellaneous

- **powerlines:** Updates around specifying builtin module paths
  ([a7288f8e](https://github.com/storm-software/powerlines/commit/a7288f8e))

## [0.37.9](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.9) (01/07/2026)

### Bug Fixes

- **powerlines:** Add support for `extension` option in `emit` functions
  ([f40fb1f0](https://github.com/storm-software/powerlines/commit/f40fb1f0))

## [0.37.7](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.7) (01/07/2026)

### Miscellaneous

- **powerlines:** Update calls to `emitBuiltin` to align with new definition
  ([e4c8668c](https://github.com/storm-software/powerlines/commit/e4c8668c))

### Bug Fixes

- **powerlines:** Ensure `id` is added to meta for emitted builtin modules
  ([f5b793d2](https://github.com/storm-software/powerlines/commit/f5b793d2))

## [0.37.6](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.6) (01/07/2026)

### Bug Fixes

- **powerlines:** Resolve issue with emitting builtin modules
  ([b2dd0b9d](https://github.com/storm-software/powerlines/commit/b2dd0b9d))

## [0.37.4](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.4) (01/06/2026)

### Bug Fixes

- **powerlines:** Ensure all dependencies are bundled in `bundle` function
  ([9a846154](https://github.com/storm-software/powerlines/commit/9a846154))

## [0.37.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.2) (01/06/2026)

### Bug Fixes

- **powerlines:** Resolve issue with `bundle` esbuild parameters
  ([04e2b511](https://github.com/storm-software/powerlines/commit/04e2b511))

## [0.37.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.37.0) (01/06/2026)

### Bug Fixes

- **powerlines:** Resolve issues with internal package import path
  ([6b6c7d8f](https://github.com/storm-software/powerlines/commit/6b6c7d8f))
- **powerlines:** Resolve issue adding nested plugins to context
  ([0478f3ec](https://github.com/storm-software/powerlines/commit/0478f3ec))

### Features

- **powerlines:** Major typing changes to support all types of `unplugin`
  builder hooks
  ([79f38aee](https://github.com/storm-software/powerlines/commit/79f38aee))

## [0.36.27](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.27) (12/31/2025)

### Miscellaneous

- **powerlines:** Added the `organization` configuration property
  ([5c653598](https://github.com/storm-software/powerlines/commit/5c653598))

## [0.36.25](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.25) (12/31/2025)

### Bug Fixes

- **powerlines:** Resolve parameter order issue in `emitEntry` function
  ([7ff7b5cc](https://github.com/storm-software/powerlines/commit/7ff7b5cc))

## [0.36.23](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.23) (12/30/2025)

### Miscellaneous

- **powerlines:** Added the `emit` and `emitSync` functions to the context
  ([92e0f2f3](https://github.com/storm-software/powerlines/commit/92e0f2f3))

## [0.36.22](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.22) (12/30/2025)

### Miscellaneous

- **powerlines:** Added synchronous emit functions and storage adapter lookup by
  preset or name
  ([922e55f5](https://github.com/storm-software/powerlines/commit/922e55f5))

## [0.36.21](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.21) (12/30/2025)

### Miscellaneous

- **powerlines:** Added the `resolveAlias` function to the context's virtual
  file system
  ([e6b43891](https://github.com/storm-software/powerlines/commit/e6b43891))

## [0.36.20](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.20) (12/30/2025)

### Miscellaneous

- **powerlines:** Pass `resolve.alias` to `tsdown` builder function
  ([7d74795a](https://github.com/storm-software/powerlines/commit/7d74795a))

## [0.36.18](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.18) (12/30/2025)

### Documentation

- **monorepo:** Update `README.md` files' badges and repository link
  ([4dff299a](https://github.com/storm-software/powerlines/commit/4dff299a))

## [0.36.17](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.17) (12/30/2025)

### Miscellaneous

- **powerlines:** Increase the `ttl` on fetch request caching
  ([06073d91](https://github.com/storm-software/powerlines/commit/06073d91))

## [0.36.13](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.13) (12/29/2025)

### Miscellaneous

- **powerlines:** Added `compatibilityDate` configuration option
  ([0f45dda1](https://github.com/storm-software/powerlines/commit/0f45dda1))

## [0.36.8](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.8) (12/28/2025)

### Miscellaneous

- **powerlines:** Clean up console log message format
  ([715f2645](https://github.com/storm-software/powerlines/commit/715f2645))
- **powerlines:** Improve type-checks in plugin helper utilities
  ([d7483731](https://github.com/storm-software/powerlines/commit/d7483731))

### Bug Fixes

- **powerlines:** Resolve issue with applying a nested array of plugin
  configurations
  ([d6047a25](https://github.com/storm-software/powerlines/commit/d6047a25))

## [0.36.7](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.7) (12/27/2025)

### Miscellaneous

- **powerlines:** Reformat Babel plugins and clean up `README.md` markdown
  ([bb349909](https://github.com/storm-software/powerlines/commit/bb349909))
- **powerlines:** Remove minify from config
  ([7f73a8ac](https://github.com/storm-software/powerlines/commit/7f73a8ac))

### Features

- **plugin-alloy:** Moved `alloy` code into separate plugin to simplify the
  design
  ([9fe9c440](https://github.com/storm-software/powerlines/commit/9fe9c440))

## [0.36.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.1) (12/23/2025)

### Bug Fixes

- **powerlines:** Resolve issue deduplicating multiple plugins at once
  ([bdc5e7ca](https://github.com/storm-software/powerlines/commit/bdc5e7ca))

## [0.36.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.36.0) (12/22/2025)

### Features

- **powerlines:** Added support for changing env paths via `framework` option
  ([0ffd26c8](https://github.com/storm-software/powerlines/commit/0ffd26c8))

## [0.35.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.35.2) (12/22/2025)

### Miscellaneous

- **powerlines:** Update plugin log message formatting to handle `':'`
  characters as a special case
  ([96383362](https://github.com/storm-software/powerlines/commit/96383362))

## [0.35.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.35.1) (12/22/2025)

### Miscellaneous

- **powerlines:** Enhance `Plugin` initialization logic to support arrays of
  plugins
  ([66843365](https://github.com/storm-software/powerlines/commit/66843365))

## [0.35.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.35.0) (12/22/2025)

### Features

- **powerlines:** Added support for persisting emited entry files and to set
  context on `emitEntry` call
  ([6f6d4305](https://github.com/storm-software/powerlines/commit/6f6d4305))

## [0.34.5](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.34.5) (12/22/2025)

### Bug Fixes

- **powerlines:** Resolve issue with providing `tsconfigRaw` to esbuild bundle
  helper
  ([2e600ad2](https://github.com/storm-software/powerlines/commit/2e600ad2))

## [0.34.4](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.34.4) (12/22/2025)

### Bug Fixes

- **powerlines:** Resolve issue with invalid parameters to `esbuild` during
  bundle
  ([1aeb3a76](https://github.com/storm-software/powerlines/commit/1aeb3a76))

## [0.34.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.34.2) (12/21/2025)

### Bug Fixes

- **powerlines:** Resolve issue applying entry points to builder
  ([54189bd8](https://github.com/storm-software/powerlines/commit/54189bd8))
- **powerlines:** Resolve issue with incorrect entry points applied during build
  ([d853a52b](https://github.com/storm-software/powerlines/commit/d853a52b))

## [0.34.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.34.1) (12/20/2025)

### Bug Fixes

- **powerlines:** Allow empty arrays in `entry` property
  ([5e0d27dd](https://github.com/storm-software/powerlines/commit/5e0d27dd))

## [0.34.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.34.0) (12/20/2025)

### Features

- **powerlines:** Added support for updating `entry` field on contexts
  ([f5861678](https://github.com/storm-software/powerlines/commit/f5861678))

## [0.33.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.33.2) (12/19/2025)

### Bug Fixes

- **powerlines:** Resolve issue applying `framework` to `output` properties
  ([3e020cc1](https://github.com/storm-software/powerlines/commit/3e020cc1))

## [0.33.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.33.1) (12/19/2025)

### Bug Fixes

- **powerlines:** Resolve issue with duplicate `assets` property
  ([8e7d41e5](https://github.com/storm-software/powerlines/commit/8e7d41e5))

## [0.33.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.33.0) (12/19/2025)

### Miscellaneous

- **powerlines:** Ensure duplicate format options aren't passed to tsup
  ([956d827b](https://github.com/storm-software/powerlines/commit/956d827b))

### Bug Fixes

- **powerlines:** Prevent issue with defaulting `dts` when `experimentalDts` is
  set ([e0feec2c](https://github.com/storm-software/powerlines/commit/e0feec2c))

### Features

- **powerlines:** Updated `entry` property to check virtual files
  ([cc6997eb](https://github.com/storm-software/powerlines/commit/cc6997eb))

## [0.32.7](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.32.7) (12/18/2025)

### Bug Fixes

- **powerlines:** Resolve issue assigning asset input paths
  ([f6d30073](https://github.com/storm-software/powerlines/commit/f6d30073))

## [0.32.6](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.32.6) (12/18/2025)

### Miscellaneous

- **monorepo:** Update CDN URLs for banner assets
  ([2782a1a3](https://github.com/storm-software/powerlines/commit/2782a1a3))

## [0.32.5](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.32.5) (12/18/2025)

### Bug Fixes

- **powerlines:** Resolve issue with duplicating asset input paths
  ([703dd8fa](https://github.com/storm-software/powerlines/commit/703dd8fa))

## [0.32.4](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.32.4) (12/18/2025)

### Bug Fixes

- **powerlines:** Resolve issue with formatting asset output path multiple times
  ([3617cfef](https://github.com/storm-software/powerlines/commit/3617cfef))

## [0.32.3](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.32.3) (12/18/2025)

### Bug Fixes

- **powerlines:** Resolve issue with incorrectly resolved assets output paths
  ([5698b189](https://github.com/storm-software/powerlines/commit/5698b189))

## [0.32.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.32.2) (12/18/2025)

### Bug Fixes

- **powerlines:** Resolve issue with empty build directory
  ([701b8730](https://github.com/storm-software/powerlines/commit/701b8730))

## [0.32.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.32.0) (12/17/2025)

### Miscellaneous

- **powerlines:** Update `enforceBuild` function to allow an array of variants
  ([4ae6425e](https://github.com/storm-software/powerlines/commit/4ae6425e))

### Features

- **powerlines:** Added the `createPowerlines` helper function
  ([c3c3e515](https://github.com/storm-software/powerlines/commit/c3c3e515))

## [0.31.5](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.31.5) (12/14/2025)

### Bug Fixes

- **powerlines:** Improve `plugins` typings for `defineConfig` function
  ([91c92581](https://github.com/storm-software/powerlines/commit/91c92581))

## [0.31.4](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.31.4) (12/14/2025)

### Miscellaneous

- **powerlines:** Revert changes to `dependsOn` types
  ([597e6873](https://github.com/storm-software/powerlines/commit/597e6873))

## [0.31.3](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.31.3) (12/14/2025)

### Bug Fixes

- **powerlines:** Update all `vite` versions to match
  ([ee7201a0](https://github.com/storm-software/powerlines/commit/ee7201a0))

## [0.31.2](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.31.2) (12/14/2025)

### Bug Fixes

- **powerlines:** Update `dedupe` types to allow any context
  ([451f36d6](https://github.com/storm-software/powerlines/commit/451f36d6))

## [0.31.1](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.31.1) (12/13/2025)

### Miscellaneous

- **monorepo:** Update workspace packages' dependencies
  ([30f7ef3a](https://github.com/storm-software/powerlines/commit/30f7ef3a))

## [0.31.0](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.31.0) (12/08/2025)

### Features

- **powerlines:** Added support to specifying a single or multiple build
  processes
  ([4efcee45](https://github.com/storm-software/powerlines/commit/4efcee45))

## [0.30.12](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.30.12) (12/08/2025)

### Miscellaneous

- **monorepo:** Ensure workspace packages have latest dependencies
  ([8af58621](https://github.com/storm-software/powerlines/commit/8af58621))
- **powerlines:** Increase strictness of Plugin typings
  ([21584b83](https://github.com/storm-software/powerlines/commit/21584b83))

## [0.30.10](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.30.10) (12/08/2025)

### Bug Fixes

- **monorepo:** Resolve issues with `stryke` package dependencies
  ([86e3e5f0](https://github.com/storm-software/powerlines/commit/86e3e5f0))

## [0.30.9](https://github.com/storm-software/powerlines/releases/tag/powerlines%400.30.9) (12/06/2025)

### Bug Fixes

- **powerlines:** Update storage types to resolve type-check issue in bundled
  code
  ([3035a6d4](https://github.com/storm-software/powerlines/commit/3035a6d4))

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
