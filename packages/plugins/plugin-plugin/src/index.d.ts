import type { Plugin } from "powerlines";
import type { PluginPluginContext, PluginPluginOptions } from "./types/plugin";
declare module "powerlines" {
    interface Config {
        plugin?: PluginPluginOptions;
    }
}
/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export declare const plugin: <TContext extends PluginPluginContext = PluginPluginContext>(options?: PluginPluginOptions) => Plugin<TContext>[];
export default plugin;
//# sourceMappingURL=index.d.ts.map