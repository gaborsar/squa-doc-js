import { isBlockNode } from "../model/Predicates";

function outdentNode(node) {
    const depth = node.getAttribute("indent") || 0;
    return depth > 0 ? node.setAttribute("indent", depth - 1 || null) : node;
}

export default function outdent(change) {
    const { value } = change;
    const { document, selection } = value;

    const nextDocument = selection.isCollapsed()
        ? document.updateDescendantAtOffset(
              selection.offset,
              isBlockNode,
              outdentNode
          )
        : document.updateDescendantsAtRange(
              selection.offset,
              selection.length,
              isBlockNode,
              outdentNode
          );

    change.setValue(value.setDocument(nextDocument));
}
