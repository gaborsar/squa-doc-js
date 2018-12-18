import { isBlockNode } from "../model/Predicates";
import getNativePosition from "./getNativePosition";
import setBaseAndExtent from "./setBaseAndExtent";

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

    setBaseAndExtent(
        nativeSelection,
        domRange.anchorNode,
        domRange.anchorOffset,
        domRange.focusNode,
        domRange.focusOffset,
        modelSelection.isBackward
    );
}
