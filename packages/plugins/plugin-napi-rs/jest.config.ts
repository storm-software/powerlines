import { declarePackage } from "@storm-software/testing-tools";

export default declarePackage({
  projectRoot: "packages/plugins/plugin-napi-rs",
  isNode: true,
  displayName: "plugin-napi-rs"
});
