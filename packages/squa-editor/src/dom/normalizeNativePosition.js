import isElementNode from "./isElementNode";
import isIgnoredNode from "./isIgnoredNode";
import isEmbedNode from "./isEmbedNode";
import isLineBreakNode from "./isLineBreakNode";
import getNodeLength from "./getNodeLength";

export default function normalizeNativePosition(node, offset) {
  if (isElementNode(node)) {
    if (isIgnoredNode(node) || isEmbedNode(node) || isLineBreakNode(node)) {
      return {
        node,
        offset: 0
      };
    }

    let length = 0;

    for (let i = 0; i < offset; i++) {
      length += getNodeLength(node.childNodes[i]);
    }

    return {
      node,
      offset: length
    };
  }

  return { node, offset };
}
