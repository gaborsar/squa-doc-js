import { isBlockNode } from "../../model/Predicates";

function outdentNode(node) {
  const depth = node.getAttribute("indent") || 0;
  return depth > 0 ? node.setAttribute("indent", depth - 1 || null) : node;
}

export default function outdent(change) {
  const value = change.getValue();

  const document = value.getDocument();
  const selection = value.getSelection();

  const newDocument = selection.isCollapsed()
    ? document.updateDescendantAtOffset(
        selection.getOffset(),
        isBlockNode,
        outdentNode
      )
    : document.updateDescendantsAtRange(
        selection.getOffset(),
        selection.getLength(),
        isBlockNode,
        outdentNode
      );

  change.setValue(value.setDocument(newDocument));
}
