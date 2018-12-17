import { NodeType } from "squa-doc-js";

function onKeyDownBackspace(change, event) {
    const { value } = change;
    const { document, selection } = value;

    if (!selection.isCollapsed) {
        return false;
    }

    const pos = document.findDescendantAtOffset(
        selection.offset,
        node => node.type === NodeType.Block
    );
    if (pos === null) {
        return false;
    }

    const { node: block } = pos;
    if (!block.isEmpty || block.getAttribute("type") !== "checkable") {
        return false;
    }

    event.preventDefault();

    let nextBlock;
    const depth = block.getAttribute("indent");
    if (depth) {
        nextBlock = block.setAttributes({ indent: depth - 1 });
    } else {
        nextBlock = block.setAttributes({ type: null, indent: null });
    }
    change.replaceNode(nextBlock, block).save();

    return true;
}

function onKeyDownEnter(change, event) {
    const { value } = change;
    const { document, selection } = value;

    if (!selection.isCollapsed) {
        return false;
    }

    const pos = document.findDescendantAtOffset(
        selection.offset,
        node => node.type === NodeType.Block
    );
    if (pos === null) {
        return false;
    }

    const { node: block } = pos;
    if (block.getAttribute("type") !== "checkable") {
        return false;
    }

    event.preventDefault();

    if (block.isEmpty) {
        let nextBlock;
        const depth = block.getAttribute("indent");
        if (depth) {
            nextBlock = block.setAttributes({ indent: depth - 1 });
        } else {
            nextBlock = block.setAttributes({ type: null, indent: null });
        }
        change.replaceNode(nextBlock, block).save();
    } else {
        change
            .insertText("\n", block.getAttributes())
            .setBlockAttributes({ checked: null })
            .save();
    }

    return true;
}

export default function onKeyDown(change, event) {
    if (event.key === "Backspace") {
        return onKeyDownBackspace(change, event);
    }

    if (event.key === "Enter") {
        return onKeyDownEnter(change, event);
    }

    return false;
}
