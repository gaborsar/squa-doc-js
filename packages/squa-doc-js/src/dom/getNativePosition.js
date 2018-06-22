import isTextNode from "./isTextNode";
import isElementNode from "./isElementNode";
import isWrapperNode from "./isWrapperNode";
import isBlockNode from "./isBlockNode";
import isEmbedNode from "./isEmbedNode";
import isLineBreakNode from "./isLineBreakNode";
import getNodeLength from "./getNodeLength";

export default function getNativePosition(node, offset) {
  let remainingOffset = offset;

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    const childLength = getNodeLength(child);

    if (isTextNode(child)) {
      if (remainingOffset <= childLength) {
        return {
          node: child,
          offset: remainingOffset
        };
      }
    } else if (isElementNode(child)) {
      if (childLength !== 0) {
        if (isEmbedNode(child) || isLineBreakNode(child)) {
          if (remainingOffset === 0) {
            return {
              node,
              offset: i
            };
          }
        } else if (isWrapperNode(child) || isBlockNode(child)) {
          if (remainingOffset < childLength) {
            return getNativePosition(child, remainingOffset);
          }
        } else {
          if (remainingOffset <= childLength) {
            return getNativePosition(child, remainingOffset);
          }
        }
      }
    }

    remainingOffset -= childLength;
  }

  return {
    node,
    offset: node.childNodes.length
  };
}
