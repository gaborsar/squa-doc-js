import Document from "./Document";
import DocumentBuilder from "./DocumentBuilder";
import Selection from "./Selection";
import Change from "./Change";

import { EDITOR_MODE_EDIT } from "../constants";

export default class Value {
  static create(props = {}) {
    return new Value(props);
  }

  static fromDelta(schema, delta) {
    const builder = new DocumentBuilder(schema);

    delta.forEach(op => {
      const { insert: value, attributes = {} } = op;

      builder.insert(value, attributes);
    });

    const document = builder.build();

    return Value.create({ document });
  }

  constructor(props = {}) {
    const {
      mode = EDITOR_MODE_EDIT,
      document = Document.create(),
      selection = Selection.create(),
      undoStack = [],
      redoStack = [],
      inlineStyleOverride = null
    } = props;

    this.mode = mode;
    this.document = document;
    this.selection = selection;
    this.undoStack = undoStack;
    this.redoStack = redoStack;
    this.inlineStyleOverride = inlineStyleOverride;
  }

  toDelta() {
    const { document: { delta } } = this;

    return delta;
  }

  merge(props) {
    return Value.create({ ...this, ...props });
  }

  get kind() {
    return "value";
  }

  get canUndo() {
    return !!this.undoStack.length;
  }

  get canRedo() {
    return !!this.redoStack.length;
  }

  get hasInlineStyleOverride() {
    return !!this.inlineStyleOverride;
  }

  change() {
    return new Change(this);
  }

  setDocument(document = Document.create()) {
    return this.merge({ document, inlineStyleOverride: null });
  }

  setSelection(selection = Selection.create()) {
    return this.merge({ selection, inlineStyleOverride: null });
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

  setInlineStyleOverride(inlineStyleOverride) {
    return this.merge({ inlineStyleOverride });
  }

  getFormat() {
    const { document, selection, inlineStyleOverride } = this;
    const { isCollapsed } = selection;

    let attributes = {};

    if (isCollapsed) {
      const { offset } = selection;

      const blockPos = document.createPosition(offset);

      if (blockPos) {
        const { node: block, offset: blockOffset } = blockPos;

        attributes = { ...attributes, ...block.style.toObject() };

        if (block.kind === "block") {
          const inlinePos = block.createPosition(blockOffset, true);

          if (inlinePos) {
            const { node: inline } = inlinePos;

            attributes = { ...attributes, ...inline.style.toObject() };
          }
        }
      }
    } else {
      const { startOffset, endOffset } = selection;

      const blockStyles = [];

      const inlineStyles = [];

      document.createRange(startOffset, endOffset).forEach(el => {
        const { node: block } = el;

        blockStyles.push(block.style);

        if (block.kind === "block") {
          const { startOffset, endOffset } = el;

          block.createRange(startOffset, endOffset).forEach(el => {
            const { node: inline } = el;

            inlineStyles.push(inline.style);
          });
        }
      });

      if (blockStyles.length) {
        let blockStyle = blockStyles.shift();

        blockStyles.forEach(currentStyle => {
          blockStyle = blockStyle.intersect(currentStyle);
        });

        attributes = { ...attributes, ...blockStyle.toObject() };
      }

      if (inlineStyles.length) {
        let inlineStyle = inlineStyles.shift();

        inlineStyles.forEach(currentStyle => {
          inlineStyle = inlineStyle.intersect(currentStyle);
        });

        attributes = { ...attributes, ...inlineStyle.toObject() };
      }
    }

    attributes = { ...attributes, ...inlineStyleOverride };

    return attributes;
  }
}
