import Delta from "quill-delta";
import Snapshot from "./Snapshot";

import { EOL, HISTORY_STACK_SIZE, HISTORY_UNDO_DELAY } from "../constants";

export default class Change {
  constructor(value) {
    this.prevValue = value;
    this.value = value;
  }

  call(fn) {
    fn(this);
    return this;
  }

  save(type = "") {
    let { prevValue: { document: prevDocument, selection }, value } = this;
    let { document, undoStack } = value;

    if (prevDocument === document) {
      return this;
    }

    const { delta: prevDelta } = prevDocument;
    const { delta } = document;

    const undoDelta = delta.diff(prevDelta, selection.startOffset);
    const redoDelta = prevDelta.diff(delta);

    let snapshot = Snapshot.create({ type, undoDelta, redoDelta, selection });

    if (type && undoStack.length > 0) {
      const lastSnapshot = undoStack[undoStack.length - 1];

      if (
        lastSnapshot.type === type &&
        snapshot.timestamp - lastSnapshot.timestamp < HISTORY_UNDO_DELAY
      ) {
        snapshot = lastSnapshot.concat(snapshot);
        undoStack = undoStack.slice(0, -1);
      }
    }

    undoStack = undoStack.concat(snapshot);

    if (undoStack.length > HISTORY_STACK_SIZE) {
      undoStack = undoStack.slice(1);
    }

    value = value.setUndoStack(undoStack).setRedoStack();

    this.prevValue = value;
    this.value = value;

    return this;
  }

  undo() {
    let { value } = this;
    let { document, selection, undoStack, redoStack } = value;

    if (undoStack.length === 0) {
      return this;
    }

    let snapshot = undoStack[undoStack.length - 1];

    const { undoDelta, selection: nextSelection } = snapshot;

    const nextDocument = document.apply(undoDelta);

    undoStack = undoStack.slice(0, -1);

    snapshot = snapshot.setSelection(selection);

    redoStack = redoStack.concat(snapshot);

    if (redoStack.length > HISTORY_STACK_SIZE) {
      redoStack = redoStack.slice(1);
    }

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
    let { document, selection, undoStack, redoStack } = value;

    if (redoStack.length === 0) {
      return this;
    }

    let snapshot = redoStack[redoStack.length - 1];

    const { redoDelta, selection: nextSelection } = snapshot;

    const nextDocument = document.apply(redoDelta);

    snapshot = snapshot.setSelection(selection);

    undoStack = undoStack.concat(snapshot);

    if (undoStack.length > HISTORY_STACK_SIZE) {
      undoStack = undoStack.slice(1);
    }

    redoStack = redoStack.slice(0, -1);

    value = value
      .setDocument(nextDocument)
      .setSelection(nextSelection)
      .setUndoStack(undoStack)
      .setRedoStack(redoStack);

    this.prevValue = value;
    this.value = value;

    return this;
  }

  setMode(mode) {
    let { value } = this;

    value = value.setMode(mode);

    this.value = value;

    return this;
  }

  moveCursorLeft() {
    let { value } = this;
    let { selection } = value;
    const { anchorOffset } = selection;

    if (anchorOffset <= 0) {
      return this;
    }

    selection = selection.setAnchorOffset(anchorOffset - 1).collapse();
    value = value.setSelection(selection);

    this.value = value;

    return this;
  }

  moveCursorRight() {
    let { value } = this;
    let { selection } = value;

    const { anchorOffset } = selection;

    if (anchorOffset >= document.length - 1) {
      return this;
    }

    selection = selection.setAnchorOffset(anchorOffset + 1).collapse();
    value = value.setSelection(selection);

    this.value = value;

    return this;
  }

  select(anchorOffset, focusOffset) {
    let { value } = this;
    let { selection } = value;

    selection = selection
      .setAnchorOffset(anchorOffset)
      .setFocusOffset(focusOffset);

    value = value.setSelection(selection);

    this.value = value;

    return this;
  }

  selectCharacterBackward() {
    let { value } = this;
    let { selection } = value;
    const { anchorOffset } = selection;

    if (anchorOffset <= 0) {
      return this;
    }

    selection = selection.setAnchorOffset(anchorOffset - 1);
    value = value.setSelection(selection);

    this.value = value;

    return this;
  }

  selectCharacterForward() {
    let { value } = this;
    let { document, selection } = value;

    const { focusOffset } = selection;

    if (focusOffset >= document.length - 1) {
      return this;
    }

    selection = selection.setFocusOffset(focusOffset + 1);
    value = value.setSelection(selection);

    this.value = value;

    return this;
  }

  selectWordBackward() {
    let { value } = this;
    let { document, selection } = value;
    const { anchorOffset } = selection;

    const pos = document.createPosition(anchorOffset);

    if (!pos) {
      return this;
    }

    const { node: { text }, offset } = pos;

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

    selection = selection.setAnchorOffset(anchorOffset - length);
    value = value.setSelection(selection);

    this.value = value;

    return this;
  }

  selectWordForward() {
    let { value } = this;
    let { document, selection } = value;
    const { focusOffset } = selection;

    const pos = document.createPosition(focusOffset);

    if (!pos) {
      return this;
    }

    const { node: { text }, offset } = pos;

    if (offset >= text.length - EOL.length) {
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

    selection = selection.setFocusOffset(focusOffset + length);
    value = value.setSelection(selection);

    this.value = value;

    return this;
  }

  selectBlockBackward() {
    let { value } = this;
    let { document, selection } = value;
    const { anchorOffset } = selection;

    const pos = document.createPosition(anchorOffset);

    if (!pos) {
      return this;
    }

    const { offset } = pos;

    if (offset === 0) {
      return this;
    }

    selection = selection.setAnchorOffset(anchorOffset - offset);
    value = value.setSelection(selection);

    this.value = value;

    return this;
  }

  selectBlockForward() {
    let { value } = this;
    let { document, selection } = value;
    const { focusOffset } = selection;

    const pos = document.createPosition(focusOffset);

    if (!pos) {
      return this;
    }

    const { node: { length }, offset } = pos;

    if (offset >= length - EOL.length) {
      return this;
    }

    selection = selection.setFocusOffset(
      focusOffset + length - EOL.length - offset
    );

    value = value.setSelection(selection);

    this.value = value;

    return this;
  }

  regenerateKey() {
    let { value } = this;
    let { document } = value;

    document = document.regenerateKey();
    value = value.setDocument(document);

    this.value = value;

    return this;
  }

  replaceBlock(newBlock, referenceBlock) {
    let { value } = this;
    let { document } = value;

    document = document.replaceChild(newBlock, referenceBlock);
    value = value.setDocument(document);

    this.value = value;

    return this;
  }

  format(attributes) {
    let { value } = this;
    let { document, selection } = value;
    const { isCollapsed, startOffset, endOffset } = selection;

    if (isCollapsed) {
      return this;
    }

    document = document.formatAt(startOffset, endOffset, attributes);
    value = value.setDocument(document);

    this.value = value;

    return this;
  }

  formatBlock(attributes) {
    let { value } = this;
    let { document, selection } = value;
    const { isCollapsed } = selection;

    if (isCollapsed) {
      const { offset } = selection;

      const pos = document.createPosition(offset);

      if (!pos) {
        return this;
      }

      const { node: block } = pos;
      const newBlock = block.format(attributes);

      document = document.replaceChild(newBlock, block);
    } else {
      const { startOffset, endOffset } = selection;

      const range = document.createRange(startOffset, endOffset);

      range.forEach(el => {
        const { node: block } = el;
        const newBlock = block.format(attributes);

        document = document.replaceChild(newBlock, block);
      });
    }

    value = value.setDocument(document).setSelection(selection);

    this.value = value;

    return this;
  }

  formatInline(attributes) {
    let { value } = this;
    let { document, selection } = value;
    const { isCollapsed } = selection;

    if (isCollapsed) {
      value = value.setInlineStyleOverride(attributes);
    } else {
      const { startOffset, endOffset } = selection;

      const range = document.createRange(startOffset, endOffset);

      range.forEach(el => {
        const { node: block, startOffset, endOffset } = el;

        if (!block.isEmbed) {
          const newBlock = block.formatAt(
            startOffset,
            Math.min(endOffset, block.length - EOL.length),
            attributes
          );

          document = document.replaceChild(newBlock, block);
        }
      });

      value = value.setDocument(document).setSelection(selection);
    }
    this.value = value;
    return this;
  }

  insertText(text, attributes = {}) {
    let { value } = this;
    let { document, selection } = value;
    const { anchorOffset } = selection;

    document = document.insertAt(anchorOffset, text, attributes);

    selection = selection
      .setAnchorOffset(anchorOffset + text.length)
      .collapse();

    value = value.setDocument(document).setSelection(selection);

    this.value = value;

    return this;
  }

  insertEmbed(data, attributes = {}) {
    let { value } = this;
    let { document, selection } = value;
    const { anchorOffset } = selection;

    document = document.insertAt(anchorOffset, data, attributes);
    selection = selection.setAnchorOffset(anchorOffset + 1).collapse();
    value = value.setDocument(document).setSelection(selection);

    this.value = value;

    return this;
  }

  insertFragment(fragment) {
    let { value } = this;
    let { document, selection } = value;
    const { anchorOffset } = selection;

    const delta = new Delta().retain(anchorOffset).concat(fragment);

    document = document.apply(delta);
    selection = selection.collapse().apply(delta);
    value = value.setDocument(document).setSelection(selection);

    this.value = value;

    return this;
  }

  delete() {
    let { value } = this;
    let { document, selection } = value;
    const { isCollapsed, startOffset, endOffset } = selection;

    if (isCollapsed) {
      return this;
    }

    const posBefore = document.createPosition(startOffset);

    if (!posBefore) {
      return this;
    }

    document = document.deleteAt(startOffset, endOffset);

    if (posBefore.offset > 0) {
      const { node: { style: styleBefore } } = posBefore;

      const posAfter = document.createPosition(startOffset);

      if (!posAfter) {
        return this;
      }

      const { node: block } = posAfter;

      if (block.style !== styleBefore) {
        const newBlock = block.setStyle(styleBefore);

        document = document.replaceChild(newBlock, block);
      }
    }

    selection = selection.setAnchorOffset(startOffset).collapse();
    value = value.setDocument(document).setSelection(selection);

    this.value = value;

    return this;
  }

  replaceBlockByKey(blockKey, newBlock) {
    let { value } = this;
    let { document } = value;

    const block = document.getChildByKey(blockKey);

    if (!block) {
      return this;
    }

    document = document.replaceChild(newBlock, block);
    value = value.setDocument(document);

    this.value = value;

    return this;
  }

  replaceInlineByKey(blockKey, inlineKey, newInline) {
    let { value } = this;
    let { document } = value;

    const block = document.getChildByKey(blockKey);

    if (!block || block.isEmbed) {
      return this;
    }

    const inline = block.getChildByKey(inlineKey);

    if (!inline) {
      return this;
    }

    const newBlock = block.replaceChild(newInline, inline);

    document = document.replaceChild(newBlock, block);
    value = value.setDocument(document);

    this.value = value;

    return this;
  }

  formatBlockByKey(blockKey, attributes) {
    let { value } = this;
    let { document } = value;

    const block = document.getChildByKey(blockKey);

    if (!block) {
      return this;
    }

    const newBlock = block.format(attributes);

    document = document.replaceChild(newBlock, block);
    value = value.setDocument(document);

    this.value = value;

    return this;
  }

  formatInlineByKey(blockKey, inlineKey, attributes) {
    let { value } = this;
    let { document } = value;

    const block = document.getChildByKey(blockKey);

    if (!block) {
      return this;
    }

    const inline = block.getChildByKey(inlineKey);

    if (!inline) {
      return this;
    }

    const newInline = inline.format(attributes);
    const newBlock = block.replaceChild(newInline, inline);

    document = document.replaceChild(newBlock, block);
    value = value.setDocument(document);

    this.value = value;

    return this;
  }

  deleteBlockByKey(blockKey) {
    let { value } = this;
    let { document } = value;

    const block = document.getChildByKey(blockKey);

    if (!block) {
      return this;
    }

    document = document.removeChild(block);
    value = value.setDocument(document);

    this.value = value;

    return this;
  }

  deleteInlineByKey(blockKey, inlineKey) {
    let { value } = this;
    let { document } = value;

    const block = document.getChildByKey(blockKey);

    if (!block) {
      return this;
    }

    const inline = block.getChildByKey(inlineKey);

    if (!inline) {
      return this;
    }

    const newBlock = block.removeChild(inline);

    document = document.replaceChild(newBlock, block);
    value = value.setDocument(document);

    this.value = value;

    return this;
  }
}
