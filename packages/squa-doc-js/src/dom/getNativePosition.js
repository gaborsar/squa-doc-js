import isElementNode from "./isElementNode";
import isTableNode from "./isTableNode";
import isTableRowNode from "./isTableRowNode";
import isTableCellNode from "./isTableCellNode";
import isWrapperNode from "./isWrapperNode";
import isBlockNode from "./isBlockNode";
import isEmbedNode from "./isEmbedNode";
import isLineBreakNode from "./isLineBreakNode";
import isTextNode from "./isTextNode";
import getNodeLength from "./getNodeLength";

export default function getNativePosition(node, offset) {
  let remainingOffset = offset;

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    const childLength = getNodeLength(child);

    if (isElementNode(child)) {
      if (childLength !== 0) {
        if (
          isTableNode(child) ||
          isTableCellNode(child) ||
          isTableRowNode(child)
        ) {
          if (remainingOffset < childLength) {
            return getNativePosition(child, remainingOffset - 1);
          }
        } else if (isWrapperNode(child) || isBlockNode(child)) {
          if (remainingOffset < childLength) {
            return getNativePosition(child, remainingOffset);
          }
        } else if (isEmbedNode(child) || isLineBreakNode(child)) {
          if (remainingOffset === 0) {
            return {
              node,
              offset: i
            };
          }
        } else {
          if (remainingOffset <= childLength) {
            return getNativePosition(child, remainingOffset);
          }
        }
      }
    } else if (isTextNode(child)) {
      if (remainingOffset <= childLength) {
        return {
          node: child,
          offset: remainingOffset
        };
      }
    }

    remainingOffset -= childLength;
  }

  return {
    node,
    offset: node.childNodes.length
  };
}
