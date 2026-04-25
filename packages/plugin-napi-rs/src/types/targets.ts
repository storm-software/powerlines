/* -------------------------------------------------------------------

                   ⚡ Storm Software - Powerlines

 This code was released as part of the Powerlines project. Powerlines
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/powerlines.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/powerlines
 Documentation:            https://docs.stormsoftware.com/projects/powerlines
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

export const AVAILABLE_TARGETS = [
  "aarch64-apple-darwin",
  "aarch64-linux-android",
  "aarch64-unknown-linux-gnu",
  "aarch64-unknown-linux-musl",
  "aarch64-unknown-linux-ohos",
  "aarch64-pc-windows-msvc",
  "x86_64-apple-darwin",
  "x86_64-pc-windows-msvc",
  "x86_64-pc-windows-gnu",
  "x86_64-unknown-linux-gnu",
  "x86_64-unknown-linux-musl",
  "x86_64-unknown-linux-ohos",
  "x86_64-unknown-freebsd",
  "i686-pc-windows-msvc",
  "armv7-unknown-linux-gnueabihf",
  "armv7-unknown-linux-musleabihf",
  "armv7-linux-androideabi",
  "universal-apple-darwin",
  "loongarch64-unknown-linux-gnu",
  "riscv64gc-unknown-linux-gnu",
  "powerpc64le-unknown-linux-gnu",
  "s390x-unknown-linux-gnu",
  "wasm32-wasi-preview1-threads",
  "wasm32-wasip1-threads"
] as const;

export type TargetTriple = (typeof AVAILABLE_TARGETS)[number];

export const DEFAULT_TARGETS = [
  "x86_64-apple-darwin",
  "aarch64-apple-darwin",
  "x86_64-pc-windows-msvc",
  "x86_64-unknown-linux-gnu"
] as const;

export type Platform = NodeJS.Platform | "wasm" | "wasi" | "openharmony";

// https://nodejs.org/api/process.html#process_process_arch
type NodeJSArch =
  | "arm"
  | "arm64"
  | "ia32"
  | "loong64"
  | "mips"
  | "mipsel"
  | "ppc"
  | "ppc64"
  | "riscv64"
  | "s390"
  | "s390x"
  | "x32"
  | "x64"
  | "universal"
  | "wasm32";

export interface Target {
  triple: string;
  platformArchABI: string;
  platform: Platform;
  arch: NodeJSArch;
  abi: string | null;
}
