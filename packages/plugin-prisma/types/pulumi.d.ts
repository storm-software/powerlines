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

declare module "@pulumi/prisma-postgres" {
  export class Project extends (await import("@pulumi/pulumi")).CustomResource {
    readonly name: import("@pulumi/pulumi").Output<string>;

    constructor(
      name: string,
      args: ProjectArgs,
      opts?: import("@pulumi/pulumi").CustomResourceOptions
    );
  }
  export interface ProjectArgs {
    name: import("@pulumi/pulumi").Input<string>;
  }
  export class Database
    extends (await import("@pulumi/pulumi")).CustomResource
  {
    readonly projectId: import("@pulumi/pulumi").Output<string>;

    readonly name: import("@pulumi/pulumi").Output<string>;

    readonly region: import("@pulumi/pulumi").Output<string>;

    constructor(
      name: string,
      args: DatabaseArgs,
      opts?: import("@pulumi/pulumi").CustomResourceOptions
    );
  }
  export interface DatabaseArgs {
    projectId: import("@pulumi/pulumi").Input<string>;
    name: import("@pulumi/pulumi").Input<string>;
    region: import("@pulumi/pulumi").Input<string>;
  }
  export class Connection
    extends (await import("@pulumi/pulumi")).CustomResource
  {
    readonly databaseId: import("@pulumi/pulumi").Output<string>;

    readonly name: import("@pulumi/pulumi").Output<string>;

    constructor(
      name: string,
      args: ConnectionArgs,
      opts?: import("@pulumi/pulumi").CustomResourceOptions
    );
  }
  export interface ConnectionArgs {
    databaseId: import("@pulumi/pulumi").Input<string>;
    name: import("@pulumi/pulumi").Input<string>;
  }
}
