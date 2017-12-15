import Document from "./Document";
import Selection from "./Selection";
import Change from "./Change";

import { EDITOR_MODE_EDIT } from "../constants";

export default class Value {
  static create(props = {}) {
    return new Value(props);
  }

  constructor(props = {}) {
    const {
      mode = EDITOR_MODE_EDIT,
      document = Document.create(),
      selection = Selection.create(),
      undoStack = [],
      redoStack = []
    } = props;

    this.mode = mode;
    this.document = document;
    this.selection = selection;
    this.undoStack = undoStack;
    this.redoStack = redoStack;
  }

  merge(props) {
    return Value.create({ ...this, ...props });
  }

  get kind() {
    return "value";
  }

  change() {
    return new Change(this);
  }

  setDocument(document = Document.create()) {
    return this.merge({ document });
  }

  setSelection(selection = Selection.create()) {
    return this.merge({ selection });
  }

  setMode(mode = EDITOR_MODE_EDIT) {
    return this.merge({ mode });
  }

  setUndoStack(undoStack = []) {
    return this.merge({ undoStack });
  }

  setRedoStack(redoStack = []) {
    return this.merge({ redoStack });
  }

  getBlockFormat() {
    const { document, selection } = this;
    const { isCollapsed } = selection;

    if (isCollapsed) {
      const { offset } = selection;

      const pos = document.createPosition(offset);

      if (!pos) {
        return {};
      }

      const { node: { style } } = pos;

      return style.toObject();
    }

    const { startOffset, endOffset } = selection;

    const styles = document
      .createRange(startOffset, endOffset)
      .map(el => el.node.style);

    if (!styles.length) {
      return {};
    }

    let style = styles.shift();

    styles.forEach(currentStyle => {
      style = style.intersect(currentStyle);
    });

    return style.toObject();
  }

  getInlineFormat() {
    const { document, selection } = this;
    const { isCollapsed } = selection;

    if (isCollapsed) {
      const { offset } = selection;

      const blockPos = document.createPosition(offset);

      if (!blockPos) {
        return {};
      }

      const { node: block, offset: blockOffset } = blockPos;

      const inlinePos = block.createPosition(blockOffset, true);

      if (!inlinePos) {
        return {};
      }

      const { node: { style } } = inlinePos;

      return style.toObject();
    }

    const { startOffset, endOffset } = selection;

    const styles = [];

    document.createRange(startOffset, endOffset).forEach(el => {
      const { node: block } = el;

      if (block.kind === "block") {
        const { startOffset, endOffset } = el;

        block.createRange(startOffset, endOffset).forEach(el => {
          styles.push(el.node.style);
        });
      }
    });

    if (!styles.length) {
      return {};
    }

    let style = styles.shift();

    styles.forEach(currentStyle => {
      style = style.intersect(currentStyle);
    });

    return style.toObject();
  }

  getFormat() {
    return {
      ...this.getBlockFormat(),
      ...this.getInlineFormat()
    };
  }
}
