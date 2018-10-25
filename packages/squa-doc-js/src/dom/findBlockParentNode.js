import { isElementNode, isBlockNode } from "./Predicates";

export default function findBlockParentNode(node) {
    let currentNode = node;
    while (
        currentNode &&
        !(isElementNode(currentNode) && isBlockNode(currentNode))
    ) {
        currentNode = currentNode.parentNode;
    }
    return currentNode;
}
