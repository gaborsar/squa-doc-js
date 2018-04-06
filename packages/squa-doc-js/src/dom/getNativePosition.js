import isTextNode from "./isTextNode";
import isElementNode from "./isElementNode";
import isWrapperNode from "./isWrapperNode";
import isBlockNode from "./isBlockNode";
import isEmbedNode from "./isEmbedNode";
import isLineBreakNode from "./isLineBreakNode";
import getNodeLength from "./getNodeLength";

export default function getNativePosition(node, offset) {
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    const childLength = getNodeLength(child);

    if (isTextNode(child)) {
      if (offset <= childLength) {
        return {
          node: child,
          offset
        };
      }
    } else if (isElementNode(child)) {
      if (childLength !== 0) {
        if (isEmbedNode(child) || isLineBreakNode(child)) {
          if (offset === 0) {
            return {
              node,
              offset: i
            };
          }
        } else if (isWrapperNode(child) || isBlockNode(child)) {
          if (offset < childLength) {
            return getNativePosition(child, offset);
          }
        } else {
          if (offset <= childLength) {
            return getNativePosition(child, offset);
          }
        }
      }
    }

    offset -= childLength;
  }

  return {
    node,
    offset: node.childNodes.length
  };
}
