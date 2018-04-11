// core features
export { default as Value } from "./model/Value";
export { default as Editor } from "./components/Editor";
export { default as combinePlugins } from "./plugins/combinePlugins";

// optional features
export { default as defaultPlugin } from "./defaults/plugin";
export {
  default as formatWithMarkdown
} from "./defaults/changes/formatWithMarkdown";
export { default as indent } from "./defaults/changes/indent";
export { default as outdent } from "./defaults/changes/outdent";
