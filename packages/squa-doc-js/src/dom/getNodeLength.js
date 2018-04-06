import isTextNode from "./isTextNode";
import isElementNode from "./isElementNode";
import isIgnoredNode from "./isIgnoredNode";
import isBlockNode from "./isBlockNode";
import isEmbedNode from "./isEmbedNode";
import isLineBreakNode from "./isLineBreakNode";

export default function getNodeLength(node) {
  if (isTextNode(node)) {
    return node.nodeValue.length;
  }

  if (isElementNode(node)) {
    if (isEmbedNode(node)) {
      return 1;
    }

    if (isIgnoredNode(node)) {
      return 0;
    }

    if (isLineBreakNode(node)) {
      return 1;
    }

    let length = 0;

    if (isBlockNode(node)) {
      length += 1;
    }

    for (const child of node.childNodes) {
      length += getNodeLength(child);
    }

    return length;
  }

  return 0;
}
