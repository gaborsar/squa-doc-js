import getModelOffset from "./getModelOffset";

export default function getModelSelection(rootNode, domSelection) {
    const anchorOffset = getModelOffset(
        rootNode,
        domSelection.anchorNode,
        domSelection.anchorOffset
    );
    if (anchorOffset === -1) {
        return null;
    }

    const focusOffset = domSelection.isCollapsed
        ? anchorOffset
        : getModelOffset(
              rootNode,
              domSelection.focusNode,
              domSelection.focusOffset
          );
    if (focusOffset === -1) {
        return null;
    }

    return { anchorOffset, focusOffset };
}
