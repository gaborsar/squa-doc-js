import { isBlockNode } from "../model/Predicates";

const MAX_DEPTH = 5;

function indentNode(node) {
    const depth = node.getAttribute("indent") || 0;
    return depth < MAX_DEPTH ? node.setAttribute("indent", depth + 1) : node;
}

export default function indent(change) {
    const { value } = change;
    const { document, selection } = value;

    const nextDocument = selection.isCollapsed()
        ? document.updateDescendantAtOffset(
              selection.offset,
              isBlockNode,
              indentNode
          )
        : document.updateDescendantsAtRange(
              selection.offset,
              selection.length,
              isBlockNode,
              indentNode
          );

    change.setValue(value.setDocument(nextDocument));
}
