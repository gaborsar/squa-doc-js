export default function findParentNode(node, predicate) {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }
  return node;
}
