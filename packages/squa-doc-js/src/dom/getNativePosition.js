import {
    isElementNode,
    isTextNode,
    isWrapperNode,
    isTableNode,
    isRowNode,
    isCellNode,
    isBlockNode,
    isEmbedNode,
    isLineBreakNode
} from "./Predicates";
import getNodeLength from "./getNodeLength";

export default function getNativePosition(node, offset) {
    let remainingOffset = offset;

    for (let i = 0, l = node.childNodes.length; i < l; i++) {
        const child = node.childNodes[i];
        const childLength = getNodeLength(child);

        if (isElementNode(child)) {
            if (childLength !== 0) {
                if (
                    isTableNode(child) ||
                    isCellNode(child) ||
                    isRowNode(child)
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
                        return { node, offset: i };
                    }
                } else {
                    if (remainingOffset <= childLength) {
                        return getNativePosition(child, remainingOffset);
                    }
                }
            }
        } else if (isTextNode(child)) {
            if (remainingOffset <= childLength) {
                return { node: child, offset: remainingOffset };
            }
        }

        remainingOffset -= childLength;
    }

    return { node, offset: node.childNodes.length };
}
