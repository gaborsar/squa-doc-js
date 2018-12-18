import { isElementNode, isBlockNode } from "./Predicates";
import setBaseAndExtent from "./setBaseAndExtent";

export default function fixBlockEndSelection(onSelect) {
    const selection = window.getSelection();
    if (!selection) {
        return;
    }

    const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
    if (
        !anchorNode ||
        !focusNode ||
        !isElementNode(focusNode) ||
        focusOffset === 0
    ) {
        return;
    }

    const childNode = focusNode.childNodes[focusOffset - 1];
    if (!isElementNode(childNode) || !isBlockNode(childNode)) {
        return;
    }

    setBaseAndExtent(
        selection,
        anchorNode,
        anchorOffset,
        anchorNode,
        anchorNode.length
    );

    window.requestAnimationFrame(onSelect);
}
