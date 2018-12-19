import {
    isElementNode,
    isTableNode,
    isRowNode,
    isCellNode,
    isBlockNode,
    isIgnoredNode
} from "./Predicates";
import getNodeLength from "./getNodeLength";

export default function getModelOffset(rootNode, domNode, domOffset) {
    let node = domNode;
    let offset = domOffset;

    if (isElementNode(node)) {
        let length = 0;
        for (let i = 0; i < offset; i++) {
            length += getNodeLength(node.childNodes[i]);
        }
        offset = length;
    }

    while (node !== rootNode && !(isElementNode(node) && isBlockNode(node))) {
        while (node.previousSibling) {
            node = node.previousSibling;
            offset += getNodeLength(node);
        }
        node = node.parentNode;
        if (isElementNode(node) && isIgnoredNode(node)) {
            offset = 0;
        }
    }
    if (!isBlockNode(node)) {
        return -1;
    }

    while (node !== rootNode) {
        while (node.previousSibling) {
            node = node.previousSibling;
            offset += getNodeLength(node);
        }
        node = node.parentNode;
        if (isTableNode(node) || isRowNode(node) || isCellNode(node)) {
            offset += 1;
        }
    }

    return offset;
}
