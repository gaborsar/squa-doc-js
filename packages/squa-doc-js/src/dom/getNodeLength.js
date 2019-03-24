import {
    isElementNode,
    isTextNode,
    isTableNode,
    isRowNode,
    isCellNode,
    isBlockNode,
    isEmbedNode,
    isIgnoredNode,
    isLineBreakNode
} from "./Predicates";

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
        if (isTableNode(node)) {
            length += 2;
        } else if (isRowNode(node) || isCellNode(node) || isBlockNode(node)) {
            length += 1;
        }
        for (let i = 0, l = node.childNodes.length; i < l; i++) {
            length += getNodeLength(node.childNodes[i]);
        }
        return length;
    }
    return 0;
}
