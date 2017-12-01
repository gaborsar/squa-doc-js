export default function isTextNode(node) {
  return node.nodeType === Node.TEXT_NODE;
}
