export default function findParentNode(node, predicate) {
  while (!predicate(node) && node.parentNode) {
    node = node.parentNode;
  }
  return node;
}
