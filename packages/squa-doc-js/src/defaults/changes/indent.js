import { isBlockNode } from "../../model/Predicates";

const MAX_DEPTH = 5;

function indentNode(node) {
  const depth = node.getAttribute("indent") || 0;
  return depth < MAX_DEPTH ? node.setAttribute("indent", depth + 1) : node;
}

export default function indent(change) {
  const value = change.getValue();

  const document = value.getDocument();
  const selection = value.getSelection();

  const newDocument = selection.isCollapsed()
    ? document.updateDescendantAtOffset(
        selection.getOffset(),
        isBlockNode,
        indentNode
      )
    : document.updateDescendantsAtRange(
        selection.getOffset(),
        selection.getLength(),
        isBlockNode,
        indentNode
      );

  change.setValue(value.setDocument(newDocument));
}
