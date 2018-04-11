import { formatWithMarkdown } from "../../squa-doc-js";

const blockMatchers = [{ expr: /^\s*\[\]\s$/, type: "checkable" }];

export default function afterInput(change) {
  formatWithMarkdown(change, { blockMatchers });
}
