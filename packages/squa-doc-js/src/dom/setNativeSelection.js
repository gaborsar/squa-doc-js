import { isBlockNode } from "../model/Predicates";
import getNativePosition from "./getNativePosition";

export default function setNativeSelection(
    rootNode,
    modelDocument,
    modelSelection
) {
    let domRange;

    if (modelSelection.isCollapsed) {
        const modelPos = modelDocument.findDescendantAtOffset(
            modelSelection.anchorOffset,
            isBlockNode
        );
        if (modelPos === null) {
            return;
        }

        const domPos = getNativePosition(
            rootNode.querySelector(`[data-key="${modelPos.node.key}"]`),
            modelPos.offset
        );
        domRange = {
            anchorNode: domPos.node,
            anchorOffset: domPos.offset,
            focusNode: domPos.node,
            focusOffset: domPos.offset
        };
    } else {
        const modelPosA = modelDocument.findDescendantAtOffset(
            modelSelection.anchorOffset,
            isBlockNode
        );
        if (modelPosA === null) {
            return;
        }

        const modelPosB = modelDocument.findDescendantAtOffset(
            modelSelection.focusOffset,
            isBlockNode
        );
        if (modelPosB === null) {
            return;
        }

        const domPosA = getNativePosition(
            rootNode.querySelector(`[data-key="${modelPosA.node.key}"]`),
            modelPosA.offset
        );
        const domPosB = getNativePosition(
            rootNode.querySelector(`[data-key="${modelPosB.node.key}"]`),
            modelPosB.offset
        );
        domRange = {
            anchorNode: domPosA.node,
            anchorOffset: domPosA.offset,
            focusNode: domPosB.node,
            focusOffset: domPosB.offset
        };
    }

    const nativeSelection = window.getSelection();
    if (!nativeSelection) {
        return;
    }
    if (
        domRange.anchorNode === nativeSelection.anchorNode &&
        domRange.anchorOffset === nativeSelection.anchorOffset &&
        domRange.focusNode === nativeSelection.focusNode &&
        domRange.focusOffset === nativeSelection.focusOffset
    ) {
        return;
    }

    if (nativeSelection.setBaseAndExtent) {
        nativeSelection.setBaseAndExtent(
            domRange.anchorNode,
            domRange.anchorOffset,
            domRange.focusNode,
            domRange.focusOffset
        );
    } else if (nativeSelection.extend) {
        const nativeRange = document.createRange();
        nativeRange.setStart(domRange.anchorNode, domRange.anchorOffset);

        nativeSelection.removeAllRanges();
        nativeSelection.addRange(nativeRange);
        nativeSelection.extend(domRange.focusNode, domRange.focusOffset);
    } else {
        const nativeRange = document.createRange();
        if (modelSelection.isBackward) {
            nativeRange.setStart(domRange.focusNode, domRange.focusOffset);
            nativeRange.setEnd(domRange.anchorNode, domRange.anchorOffset);
        } else {
            nativeRange.setStart(domRange.anchorNode, domRange.anchorOffset);
            nativeRange.setEnd(domRange.focusNode, domRange.focusOffset);
        }

        nativeSelection.removeAllRanges();
        nativeSelection.addRange(nativeRange);
    }
}
