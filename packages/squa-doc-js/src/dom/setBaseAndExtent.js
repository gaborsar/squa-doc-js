export default function setBaseAndExtent(
    selection,
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
    isBackward = false
) {
    if (selection.setBaseAndExtent) {
        selection.setBaseAndExtent(
            anchorNode,
            anchorOffset,
            focusNode,
            focusOffset
        );
    } else if (selection.extend) {
        const range = document.createRange();
        range.setStart(anchorNode, anchorOffset);

        selection.removeAllRanges();
        selection.addRange(range);
        selection.extend(focusNode, focusOffset);
    } else {
        const range = document.createRange();

        if (isBackward) {
            range.setStart(focusNode, focusOffset);
            range.setEnd(anchorNode, anchorOffset);
        } else {
            range.setStart(anchorNode, anchorOffset);
            range.setEnd(focusNode, focusOffset);
        }

        selection.removeAllRanges();
        selection.addRange(range);
    }
}
