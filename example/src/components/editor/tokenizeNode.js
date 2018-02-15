export default function tokenizeNode(node) {
  const tokens = [];

  if (node.classList.contains("checkable")) {
    tokens.push({
      block: {
        type: "checkable"
      }
    });
  }

  if (node.classList.contains("checked")) {
    tokens.push({
      block: {
        checked: true
      }
    });
  }

  return tokens;
}
