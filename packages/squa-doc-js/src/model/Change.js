import Delta from "quill-delta";
import Snapshot from "./Snapshot";
import {
  isTableNode,
  isBlockNode,
  isBlockOrBlockEmbedNode
} from "./Predicates";
import { setAttributes, setAttributesAt } from "./Updaters";

export default class Change {
  constructor(value) {
    this.prevValue = value;
    this.value = value;
  }

  // Getters

  getPrevValue() {
    return this.prevValue;
  }

  getValue() {
    return this.value;
  }

  // Setters

  setPrevValue(prevValue) {
    this.prevValue = prevValue;
    return this;
  }

  setValue(value) {
    this.value = value;
    return this;
  }

  // Changes

  call(fn) {
    fn(this);
    return this;
  }

  // History

  save(type = "") {
    let { prevValue, value } = this;

    const prevDocument = prevValue.getDocument();
    const prevSelection = prevValue.getSelection();

    const document = value.getDocument();

    let undoStack = value.getUndoStack();
    let redoStack = value.getRedoStack();

    const undoDelta = document.diff(prevDocument);
    const redoDelta = prevDocument.diff(document);

    let snapshot = new Snapshot({
      type,
      undoDelta,
      redoDelta,
      selection: prevSelection
    });

    if (snapshot.hasType() && !undoStack.isEmpty()) {
      const lastSnapshot = undoStack.last();

      if (lastSnapshot.canCompose(snapshot)) {
        snapshot = lastSnapshot.compose(snapshot);
        undoStack = undoStack.init();
      }
    }

    undoStack = undoStack.push(snapshot);
    redoStack = redoStack.clear();

    value = value.setUndoStack(undoStack).setRedoStack(redoStack);

    this.prevValue = value;
    this.value = value;

    return this;
  }

  undo() {
    let { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    let undoStack = value.getUndoStack();
    let redoStack = value.getRedoStack();

    if (undoStack.isEmpty()) {
      return this;
    }

    const undoSnapshot = undoStack.last();

    const undoDelta = undoSnapshot.getUndoDelta();
    const nextSelection = undoSnapshot.getSelection();
    const nextDocument = document.apply(undoDelta);

    const redoSnapshot = undoSnapshot.setSelection(selection);

    undoStack = undoStack.init();
    redoStack = redoStack.push(redoSnapshot);

    value = value
      .setDocument(nextDocument)
      .setSelection(nextSelection)
      .setUndoStack(undoStack)
      .setRedoStack(redoStack);

    this.prevValue = value;
    this.value = value;

    return this;
  }

  redo() {
    let { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    let undoStack = value.getUndoStack();
    let redoStack = value.getRedoStack();

    if (redoStack.isEmpty()) {
      return this;
    }

    const redoSnapshot = redoStack.last();

    const redoDelta = redoSnapshot.getRedoDelta();
    const nextSelection = redoSnapshot.getSelection();
    const nextDocument = document.apply(redoDelta);

    const undoSnapshot = redoSnapshot.setSelection(selection);

    undoStack = undoStack.push(undoSnapshot);
    redoStack = redoStack.init();

    value = value
      .setDocument(nextDocument)
      .setSelection(nextSelection)
      .setUndoStack(undoStack)
      .setRedoStack(redoStack);

    this.prevValue = value;
    this.value = value;

    return this;
  }

  // Deltas

  apply(delta) {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const newDocument = document.apply(delta);
    const newSelection = selection.apply(delta);

    this.value = value.setDocument(newDocument).setSelection(newSelection);

    return this;
  }

  // Editor mode

  startComposing() {
    const { value } = this;

    this.value = value.setMode("compose");

    return this;
  }

  stopComposing() {
    const { value } = this;

    this.value = value.setMode("edit");

    return this;
  }

  // Document

  regenerateKey() {
    const { value } = this;

    this.value = value.setDocument(value.getDocument().regenerateKey());

    return this;
  }

  // Selection

  select(offset, length) {
    const { value } = this;

    const selection = value.getSelection();
    const newSelection = selection
      .setAnchorOffset(offset)
      .setFocusOffset(offset + length);

    this.value = value.setSelection(newSelection);

    return this;
  }

  selectAll() {
    const { value } = this;

    const document = value.getDocument();
    const length = document.getLength();

    return this.select(0, length);
  }

  collapse() {
    const { value } = this;

    const selection = value.getSelection();
    const newSelection = selection.collapse();

    this.value = value.setSelection(newSelection);

    return this;
  }

  collapseToLeft() {
    const { value } = this;

    const selection = value.getSelection();
    const newSelection = selection.collapseToLeft();

    this.value = value.setSelection(newSelection);

    return this;
  }

  collapseToRight() {
    const { value } = this;

    const selection = value.getSelection();
    const newSelection = selection.collapseToRight();

    this.value = value.setSelection(newSelection);

    return this;
  }

  selectCharacterBackward() {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const focusOffset = selection.getFocusOffset();

    const pos = document.findDescendantAtOffset(focusOffset, isBlockNode);

    if (pos === null) {
      return this;
    }

    const block = pos.getNode();
    const offset = pos.getOffset();

    if (offset === 0) {
      const previousSibling = document.findPreviousDescendant(block);

      if (previousSibling === null) {
        return this;
      }

      if (isTableNode(previousSibling)) {
        return this;
      }
    }

    const newSelection = selection.setFocusOffset(focusOffset - 1);

    this.value = value.setSelection(newSelection);

    return this;
  }

  selectCharacterForward() {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const focusOffset = selection.getFocusOffset();

    const pos = document.findDescendantAtOffset(focusOffset, isBlockNode);

    if (pos === null) {
      return this;
    }

    const block = pos.getNode();
    const offset = pos.getOffset();

    if (offset === block.getLength() - 1) {
      const nextSibling = document.findNextDescendant(block);

      if (nextSibling === null) {
        return this;
      }

      if (isTableNode(nextSibling)) {
        return this;
      }
    }

    const newSelection = selection.setFocusOffset(focusOffset + 1);

    this.value = value.setSelection(newSelection);

    return this;
  }

  selectWordBackward() {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const focusOffset = selection.getFocusOffset();

    const pos = document.findDescendantAtOffset(focusOffset, isBlockNode);

    if (pos === null) {
      return this;
    }

    const block = pos.getNode();
    const offset = pos.getOffset();

    const text = block.getText();

    if (offset === 0) {
      return this;
    }

    let length = 0;

    while (/\W/.test(text[offset - length - 1]) && offset - length > 0) {
      length += 1;
    }

    while (/\w/.test(text[offset - length - 1]) && offset - length > 0) {
      length += 1;
    }

    if (length === 0) {
      return this;
    }

    const newSelection = selection.setFocusOffset(focusOffset - length);

    this.value = value.setSelection(newSelection);

    return this;
  }

  selectWordForward() {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const focusOffset = selection.getFocusOffset();

    const pos = document.findDescendantAtOffset(focusOffset, isBlockNode);

    if (pos === null) {
      return this;
    }

    const block = pos.getNode();
    const offset = pos.getOffset();

    const text = block.getText();

    if (offset >= text.length - 1) {
      return this;
    }

    let length = 0;

    while (/\W/.test(text[offset + length]) && offset + length < text.length) {
      length += 1;
    }

    while (/\w/.test(text[offset + length]) && offset + length < text.length) {
      length += 1;
    }

    if (length === 0) {
      return this;
    }

    const newSelection = selection.setFocusOffset(focusOffset + length);

    this.value = value.setSelection(newSelection);

    return this;
  }

  selectBlockBackward() {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const anchorOffset = selection.getAnchorOffset();

    const pos = document.findDescendantAtOffset(anchorOffset, isBlockNode);

    if (pos === null) {
      return this;
    }

    const offset = pos.getOffset();

    const newSelection = selection.setFocusOffset(anchorOffset - offset);

    this.value = value.setSelection(newSelection);

    return this;
  }

  selectBlockForward() {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const anchorOffset = selection.getAnchorOffset();

    const pos = document.findDescendantAtOffset(anchorOffset, isBlockNode);

    if (pos === null) {
      return this;
    }

    const block = pos.getNode();
    const offset = pos.getOffset();

    const length = block.getLength();

    if (offset >= length - 1) {
      return this;
    }

    const newSelection = selection.setFocusOffset(
      anchorOffset + length - 1 - offset
    );

    this.value = value.setSelection(newSelection);

    return this;
  }

  // Edits by the current selection

  delete() {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const offset = selection.getOffset();
    const length = selection.getLength();

    const delta = new Delta().retain(offset).delete(length);

    const posBefore = document.findDescendantAtOffset(offset, isBlockNode);

    let newDocument = document.apply(delta);

    if (posBefore !== null) {
      const posAfter = newDocument.findDescendantAtOffset(offset, isBlockNode);

      if (posAfter !== null) {
        const block = posAfter
          .getNode()
          .setStyle(posBefore.getNode().getStyle());

        newDocument = newDocument.replaceDescendantByKey(block.getKey(), block);
      }
    }

    const newSelection = selection.apply(delta);

    this.value = value.setDocument(newDocument).setSelection(newSelection);

    return this;
  }

  insertText(text, attributes) {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();
    const inlineStyleOverride = value.getInlineStyleOverride();

    const delta = new Delta()
      .retain(selection.getOffset())
      .insert(text, { ...attributes, ...inlineStyleOverride });

    const newDocument = document.apply(delta);
    const newSelection = selection.apply(delta);

    this.value = value.setDocument(newDocument).setSelection(newSelection);

    return this;
  }

  insertEmbed(data, attributes) {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const delta = new Delta()
      .retain(selection.getOffset())
      .insert(data, attributes);

    const newDocument = document.apply(delta);
    const newSelection = selection.apply(delta);

    this.value = value.setDocument(newDocument).setSelection(newSelection);

    return this;
  }

  insertFragment(fragment) {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const delta = new Delta().retain(selection.getOffset()).concat(fragment);
    const newDocument = document.apply(delta);
    const newSelection = selection.apply(delta);

    this.value = value.setDocument(newDocument).setSelection(newSelection);

    return this;
  }

  setAttributes(attributes) {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const delta = new Delta()
      .retain(selection.getOffset())
      .retain(selection.getLength(), attributes);

    const newDocument = document.apply(delta);

    this.value = value.setDocument(newDocument);

    return this;
  }

  setBlockAttributes(attributes) {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const newDocument = selection.isCollapsed()
      ? document.updateDescendantAtOffset(
          selection.getOffset(),
          isBlockOrBlockEmbedNode,
          setAttributes(attributes)
        )
      : document.updateDescendantsAtRange(
          selection.getOffset(),
          selection.getLength(),
          isBlockOrBlockEmbedNode,
          setAttributes(attributes)
        );

    this.value = value.setDocument(newDocument);

    return this;
  }

  setInlineAttributes(attributes) {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    if (selection.isCollapsed()) {
      return this.setValue(value.setInlineStyleOverride(attributes));
    }

    const newDocument = document.updateDescendantsAtRange(
      selection.getOffset(),
      selection.getLength(),
      isBlockNode,
      setAttributesAt(attributes)
    );

    this.value = value.setDocument(newDocument);

    return this;
  }

  // Edits by reference

  removeNode(node) {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const newDocument = document.removeDescendantByKey(node.getKey());
    const delta = document.diff(newDocument);
    const newSelection = selection.apply(delta);

    this.value = value.setDocument(newDocument).setSelection(newSelection);

    return this;
  }

  replaceNode(node, referenceNode) {
    const { value } = this;

    const document = value.getDocument();
    const selection = value.getSelection();

    const newDocument = document.replaceDescendantByKey(
      referenceNode.getKey(),
      node
    );
    const delta = document.diff(newDocument);
    const newSelection = selection.apply(delta);

    this.value = value.setDocument(newDocument).setSelection(newSelection);

    return this;
  }
}
