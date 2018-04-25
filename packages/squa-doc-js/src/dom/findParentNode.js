export default function findParentNode(node, predicate) {
  let currentNode = node;
  while (currentNode && !predicate(currentNode)) {
    currentNode = currentNode.parentNode;
  }
  return currentNode;
}
