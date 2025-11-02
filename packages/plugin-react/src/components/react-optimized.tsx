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

import { code, splitProps } from "@alloy-js/core";
import { FunctionDeclaration } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/alloy/core/contexts/context";
import { refkey } from "@powerlines/alloy/helpers/refkey";
import {
  BuiltinFile,
  BuiltinFileProps
} from "@powerlines/alloy/typescript/components/builtin-file";

import {
  TSDoc,
  TSDocLink,
  TSDocReturns
} from "@powerlines/alloy/typescript/components/tsdoc";
import defu from "defu";
import { ReactPluginContext } from "../types/plugin";

export interface ReactOptimizedBuiltinProps
  extends Omit<BuiltinFileProps, "id"> {
  override?: boolean;
}

const isOptimizationEnabledRefkey = refkey("isOptimizationEnabled");

/**
 * Generates the `react/optimized` builtin module for the Powerlines project.
 */
export function ReactOptimizedBuiltin(props: ReactOptimizedBuiltinProps) {
  const [{ override }, rest] = splitProps(props, ["override"]);

  const context = usePowerlines<ReactPluginContext>();

  return (
    <BuiltinFile
      {...rest}
      id="react/optimized"
      description="A built-in module to provide access to environment configuration to determine React optimizations."
      imports={defu(
        {
          [`${context?.config.output.builtinPrefix}:env`]: [
            "env",
            "isDevelopment"
          ]
        },
        rest.imports ?? {}
      )}>
      <TSDoc heading="A gating function to determine if the optimized [React compiler](https://react.dev/reference/react-compiler) source code should be used.">
        <TSDocLink>
          {`https://react.dev/reference/react-compiler/gating`}
        </TSDocLink>
        <TSDocReturns>
          {`A boolean indicating if the React compiler's optimizations should be used.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        refkey={isOptimizationEnabledRefkey}
        async={false}
        export={true}
        name="isOptimizationEnabled"
        returnType="boolean">
        {override !== undefined
          ? code`return ${override};`
          : code`return !env.DISABLE_REACT_COMPILER && !isDevelopment; `}
      </FunctionDeclaration>
    </BuiltinFile>
  );
}
