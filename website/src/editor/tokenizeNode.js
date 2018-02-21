export default function tokenizeNode(node) {
  const tokens = [];

  if (node.classList.contains("checkable")) {
    tokens.push({
      type: "block-node",
      payload: {
        type: "checkable"
      }
    });
  }

  if (node.classList.contains("checked")) {
    tokens.push({
      type: "block-style",
      payload: {
        checked: true
      }
    });
  }

  return tokens;
}
