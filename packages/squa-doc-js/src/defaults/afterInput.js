import formatWithMarkdown from "./changes/formatWithMarkdown";

const blockMatchers = [
  { expr: /^\s*#\s$/, type: "heading-one" },
  { expr: /^\s*#{2}\s$/, type: "heading-two" },
  { expr: /^\s*#{3}\s$/, type: "heading-three" },
  { expr: /^\s*#{4}\s$/, type: "heading-four" },
  { expr: /^\s*#{5}\s$/, type: "heading-five" },
  { expr: /^\s*#{6}\s$/, type: "heading-six" },
  { expr: /^\s*\*\s$/, type: "unordered-list-item" },
  { expr: /^\s*1[.)]\s$/, type: "ordered-list-item" },
  { expr: /^\s*```\s$/, type: "code" },
  { expr: /^\s*>\s$/, type: "blockquote" }
];

const inlineMatchers = [
  { expr: /(\*{2})(.+)(\*{2})\s$/, type: "bold" },
  { expr: /(_{2})(.+)(_{2})\s$/, type: "bold" },
  { expr: /(\*)(.+)(\*)\s$/, type: "italic" },
  { expr: /(_)(.+)(_)\s$/, type: "italic" },
  { expr: /(`)(.+)(`)\s$/, type: "code" }
];

export default function afterInput(change) {
  formatWithMarkdown(change, { blockMatchers, inlineMatchers });
}
