import Delta from "quill-delta";
import EditorMode from "./EditorMode";
import Snapshot from "./Snapshot";
import {
    isTableNode,
    isBlockNode,
    isBlockLevelNode,
    isTablePartNode
} from "./Predicates";

export default class Change {
    constructor(value) {
        this.prevValue = value;
        this.value = value;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    call(fn) {
        fn(this);
        return this;
    }

    save(type = "") {
        const { prevValue, value } = this;
        const { document: prevDocument, selection: prevSelection } = prevValue;
        const { document, undoStack, redoStack } = value;

        const undoDelta = document.diff(prevDocument);
        const redoDelta = prevDocument.diff(document);

        let snapshot = new Snapshot({
            type,
            undoDelta,
            redoDelta,
            selection: prevSelection
        });

        let nextUndoStack = undoStack;

        if (snapshot.hasType && !nextUndoStack.isEmpty) {
            const lastSnapshot = nextUndoStack.last();

            if (lastSnapshot.canCompose(snapshot)) {
                snapshot = lastSnapshot.compose(snapshot);
                nextUndoStack = nextUndoStack.init();
            }
        }

        nextUndoStack = nextUndoStack.push(snapshot);

        const nextValue = value
            .setUndoStack(nextUndoStack)
            .setRedoStack(redoStack.clear());

        this.prevValue = nextValue;
        this.value = nextValue;

        return this;
    }

    undo() {
        const { value } = this;
        const { document, selection, undoStack, redoStack } = value;

        if (undoStack.isEmpty) {
            return this;
        }

        const undoSnapshot = undoStack.last();
        const redoSnapshot = undoSnapshot.setSelection(selection);

        const nextDocument = document.apply(undoSnapshot.undoDelta);
        const nextSelection = undoSnapshot.selection;

        const nextUndoStack = undoStack.init();
        const nextRedoStack = redoStack.push(redoSnapshot);

        const nextValue = value
            .setDocument(nextDocument)
            .setSelection(nextSelection)
            .setUndoStack(nextUndoStack)
            .setRedoStack(nextRedoStack);

        this.prevValue = nextValue;
        this.value = nextValue;

        return this;
    }

    redo() {
        const { value } = this;
        const { document, selection, undoStack, redoStack } = value;

        if (redoStack.isEmpty) {
            return this;
        }

        const redoSnapshot = redoStack.last();
        const undoSnapshot = redoSnapshot.setSelection(selection);

        const nextDocument = document.apply(redoSnapshot.redoDelta);
        const nextSelection = redoSnapshot.selection;

        const nextUndoStack = undoStack.push(undoSnapshot);
        const nextRedoStack = redoStack.init();

        const nextValue = value
            .setDocument(nextDocument)
            .setSelection(nextSelection)
            .setUndoStack(nextUndoStack)
            .setRedoStack(nextRedoStack);

        this.prevValue = nextValue;
        this.value = nextValue;

        return this;
    }

    apply(delta) {
        const { value } = this;
        const { document, selection } = value;

        const nextDocument = document.apply(delta);
        const nextSelection = selection.apply(delta);

        this.value = value
            .setDocument(nextDocument)
            .setSelection(nextSelection);

        return this;
    }

    startComposing() {
        const { value } = this;

        this.value = value.setMode(EditorMode.Compose);

        return this;
    }

    stopComposing() {
        const { value } = this;

        this.value = value.setMode(EditorMode.Edit);

        return this;
    }

    regenerateKey() {
        const { value } = this;
        const { document } = value;

        this.value = value.setDocument(document.regenerateKey());

        return this;
    }

    select(anchorOffset, focusOffset) {
        const { value } = this;
        const { selection } = value;

        const nextSelection = selection
            .setAnchorOffset(anchorOffset)
            .setFocusOffset(focusOffset);

        this.value = value.setSelection(nextSelection);

        return this;
    }

    selectAll() {
        return this.select(0, this.value.document.length - 1);
    }

    collapse() {
        const { value } = this;
        const { selection } = value;

        const nextSelection = selection.collapse();

        this.value = value.setSelection(nextSelection);

        return this;
    }

    collapseToLeft() {
        const { value } = this;
        const { selection } = value;

        const nextSelection = selection.collapseToLeft();

        this.value = value.setSelection(nextSelection);

        return this;
    }

    collapseToRight() {
        const { value } = this;
        const { selection } = value;

        const nextSelection = selection.collapseToRight();

        this.value = value.setSelection(nextSelection);

        return this;
    }

    selectCharacterBackward() {
        const { value } = this;
        const { document, selection } = value;

        const pos = document.findDescendantAtOffset(
            selection.focusOffset,
            isBlockNode
        );
        if (pos === null) {
            return this;
        }

        if (pos.offset === 0) {
            const prevNode = document.findPreviousDescendant(pos.node);
            if (prevNode === null) {
                return this;
            }
            if (isTableNode(prevNode)) {
                return this;
            }
        }

        const nextSelection = selection.setFocusOffset(
            selection.focusOffset - 1
        );

        this.value = value.setSelection(nextSelection);

        return this;
    }

    selectCharacterForward() {
        const { value } = this;
        const { document, selection } = value;

        const pos = document.findDescendantAtOffset(
            selection.focusOffset,
            isBlockNode
        );
        if (pos === null) {
            return this;
        }

        if (pos.offset === pos.node.length - 1) {
            const nextNode = document.findNextDescendant(pos.node);
            if (nextNode === null) {
                return this;
            }
            if (isTableNode(nextNode)) {
                return this;
            }
        }

        const nextSelection = selection.setFocusOffset(
            selection.focusOffset + 1
        );

        this.value = value.setSelection(nextSelection);

        return this;
    }

    selectWordBackward() {
        const { value } = this;
        const { document, selection } = value;

        const pos = document.findDescendantAtOffset(
            selection.focusOffset,
            isBlockNode
        );
        if (pos === null) {
            return this;
        }
        if (pos.offset === 0) {
            return this;
        }

        const { text } = pos.node;
        let length = 0;

        while (
            /\W/.test(text[pos.offset - length - 1]) &&
            pos.offset - length > 0
        ) {
            length += 1;
        }
        while (
            /\w/.test(text[pos.offset - length - 1]) &&
            pos.offset - length > 0
        ) {
            length += 1;
        }

        const nextSelection = selection.setFocusOffset(
            selection.focusOffset - length
        );

        this.value = value.setSelection(nextSelection);

        return this;
    }

    selectWordForward() {
        const { value } = this;
        const { document, selection } = value;

        const pos = document.findDescendantAtOffset(
            selection.focusOffset,
            isBlockNode
        );
        if (pos === null) {
            return this;
        }
        if (pos.offset === pos.node.length - 1) {
            return this;
        }

        const { text } = pos.node;
        let length = 0;

        while (
            /\W/.test(text[pos.offset + length]) &&
            pos.offset + length < text.length
        ) {
            length += 1;
        }
        while (
            /\w/.test(text[pos.offset + length]) &&
            pos.offset + length < text.length
        ) {
            length += 1;
        }

        const nextSelection = selection.setFocusOffset(
            selection.focusOffset + length
        );

        this.value = value.setSelection(nextSelection);

        return this;
    }

    selectBlockBackward() {
        const { value } = this;
        const { document, selection } = value;

        const pos = document.findDescendantAtOffset(
            selection.focusOffset,
            isBlockNode
        );
        if (pos === null) {
            return this;
        }
        if (pos.offset === 0) {
            return this;
        }

        const nextSelection = selection.setFocusOffset(
            selection.focusOffset - pos.offset
        );

        this.value = value.setSelection(nextSelection);

        return this;
    }

    selectBlockForward() {
        const { value } = this;
        const { document, selection } = value;

        const pos = document.findDescendantAtOffset(
            selection.focusOffset,
            isBlockNode
        );
        if (pos === null) {
            return this;
        }
        if (pos.offset === pos.node.length - 1) {
            return this;
        }

        const nextSelection = selection.setFocusOffset(
            selection.focusOffset - pos.offset + pos.node.length - 1
        );

        this.value = value.setSelection(nextSelection);

        return this;
    }

    insertText(text, attributes) {
        const { value } = this;
        const { document, selection, inlineStyleOverride } = value;

        const delta = new Delta().retain(selection.offset).insert(text, {
            ...attributes,
            ...inlineStyleOverride
        });

        const nextDocument = document.apply(delta);
        const nextSelection = selection.collapseToLeft().apply(delta);

        this.value = value
            .setDocument(nextDocument)
            .setSelection(nextSelection);

        return this;
    }

    insertEmbed(data, attributes) {
        const { value } = this;
        const { document, selection } = value;

        const delta = new Delta()
            .retain(selection.offset)
            .insert(data, attributes);

        const nextDocument = document.apply(delta);
        const nextSelection = selection.collapseToLeft().apply(delta);

        this.value = value
            .setDocument(nextDocument)
            .setSelection(nextSelection);

        return this;
    }

    insertFragment(fragment) {
        const { value } = this;
        const { document, selection } = value;

        const delta = new Delta().retain(selection.offset).concat(fragment);

        const nextDocument = document.apply(delta);
        const nextSelection = selection.collapseToLeft().apply(delta);

        this.value = value
            .setDocument(nextDocument)
            .setSelection(nextSelection);

        return this;
    }

    setAttributes(attributes) {
        const { value } = this;
        const { document, selection } = value;

        const nextDocument = document
            .editor()
            .retain(selection.offset)
            .retain(selection.length, attributes)
            .build();

        this.value = value.setDocument(nextDocument);

        return this;
    }

    setBlockAttributes(attributes) {
        const { value } = this;
        const { document, selection } = value;

        const nextDocument = selection.isCollapsed
            ? document.updateDescendantAtOffset(
                  selection.offset,
                  isBlockLevelNode,
                  node => node.setAttributes(attributes)
              )
            : document.updateDescendantsAtRange(
                  selection.offset,
                  selection.length,
                  isBlockLevelNode,
                  node => node.setAttributes(attributes)
              );

        this.value = value.setDocument(nextDocument);

        return this;
    }

    setInlineAttributes(attributes) {
        const { value } = this;
        const { document, selection } = value;

        if (selection.isCollapsed) {
            this.value = value.setInlineStyleOverride(attributes);
        } else {
            const nextDocument = document.updateDescendantsAtRange(
                selection.offset,
                selection.length,
                isBlockNode,
                (node, offset, length) =>
                    node
                        .editor()
                        .retain(offset)
                        .retain(length, attributes)
                        .retain(Infinity)
                        .build()
            );

            this.value = value.setDocument(nextDocument);
        }

        return this;
    }

    setAttribute(name, value) {
        return this.setAttributes({ [name]: value });
    }

    setBlockAttribute(name, value) {
        return this.setBlockAttributes({ [name]: value });
    }

    setInlineAttribute(name, value) {
        return this.setInlineAttributes({ [name]: value });
    }

    removeAttribute(name) {
        return this.setAttribute(name, null);
    }

    removeBlockAttribute(name) {
        return this.setAttribute(name, null);
    }

    removeInlineAttribute(name) {
        return this.setInlineAttribute(name, null);
    }

    toggleAttribute(name, value) {
        const attributes = this.value.getAttributes();
        return this.setAttribute(
            name,
            attributes[name] === value ? null : value
        );
    }

    toggleBlockAttribute(name, value) {
        const attributes = this.value.getBlockAttributes();
        return this.setBlockAttribute(
            name,
            attributes[name] === value ? null : value
        );
    }

    toggleInlineAttribute(name, value) {
        const attributes = this.value.getInlineAttributes();
        return this.setInlineAttribute(
            name,
            attributes[name] === value ? null : value
        );
    }

    delete() {
        const { value } = this;
        const { document, selection } = value;

        let nextDocument = document
            .editor()
            .retain(selection.offset)
            .filter(selection.length, isTablePartNode)
            .build();

        const pos = document.findDescendantAtOffset(
            selection.offset,
            isBlockNode
        );
        if (pos !== null) {
            nextDocument = nextDocument.updateDescendantAtOffset(
                selection.offset,
                isBlockNode,
                node => node.setStyle(pos.node.style)
            );
        }

        const nextSelection = selection.collapseToLeft();

        this.value = value
            .setDocument(nextDocument)
            .setSelection(nextSelection);

        return this;
    }

    removeNode(node) {
        const { value } = this;
        const { document, selection } = value;

        const nextDocument = document.removeDescendantByKey(node.key);
        const delta = document.diff(nextDocument);
        const nextSelection = selection.apply(delta);

        this.value = value
            .setDocument(nextDocument)
            .setSelection(nextSelection);

        return this;
    }

    replaceNode(node, referenceNode) {
        const { value } = this;
        const { document, selection } = value;

        const nextDocument = document.replaceDescendantByKey(
            referenceNode.key,
            node
        );
        const delta = document.diff(nextDocument);
        const nextSelection = selection.apply(delta);

        this.value = value
            .setDocument(nextDocument)
            .setSelection(nextSelection);

        return this;
    }
}
