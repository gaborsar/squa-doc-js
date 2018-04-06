export default function isIgnoredNode(node) {
  return (
    node.hasAttribute("data-ignore") ||
    node.getAttribute("contenteditable") === "false"
  );
}
