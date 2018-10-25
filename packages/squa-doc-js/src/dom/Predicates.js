export function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}

export function isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
}

export function isWrapperNode(node) {
    return node.hasAttribute("data-wrapper");
}

export function isTableNode(node) {
    return node.hasAttribute("data-table");
}

export function isRowNode(node) {
    return node.hasAttribute("data-row");
}

export function isCellNode(node) {
    return node.hasAttribute("data-cell");
}

export function isBlockNode(node) {
    return node.hasAttribute("data-block");
}

export function isEmbedNode(node) {
    return node.hasAttribute("data-embed");
}

export function isIgnoredNode(node) {
    return node.hasAttribute("data-ignore");
}

export function isLineBreakNode(node) {
    return node.nodeName === "BR";
}
