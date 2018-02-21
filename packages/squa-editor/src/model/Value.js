import Delta from "quill-delta";
import Document from "./Document";
import DocumentBuilder from "./DocumentBuilder";
import Selection from "./Selection";
import Change from "./Change";
import extendSchema from "./extendSchema";
import defaultSchema from "../defaults/schema";

import { EOL, EDITOR_MODE_EDIT } from "../constants";

const defaultContents = [{ insert: EOL }];

export default class Value {
  static create(props = {}) {
    return new Value(props);
  }

  static fromJSON(props = {}) {
    const { schema: customSchema = {}, contents = defaultContents } = props;

    const schema = extendSchema(defaultSchema, customSchema);

    const delta = new Delta(contents);

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

  merge(props) {
    return Value.create({ ...this, ...props });
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

  get contents() {
    return this.document.delta;
  }

  change() {
    return new Change(this);
  }

  setDocument(document = Document.create()) {
    return this.merge({
      document,
      inlineStyleOverride: null
    });
  }

  setSelection(selection = Selection.create()) {
    return this.merge({
      selection,
      inlineStyleOverride: null
    });
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

        attributes = {
          ...attributes,
          ...block.style.toObject()
        };

        if (!block.isEmbed) {
          const inlinePos = block.createPosition(blockOffset, true);

          if (inlinePos) {
            attributes = {
              ...attributes,
              ...inlinePos.node.style.toObject()
            };
          }
        }
      }
    } else {
      const { startOffset, endOffset } = selection;

      const blockStyles = [];
      const inlineStyles = [];

      const range = document.createRange(startOffset, endOffset);

      range.forEach(el => {
        const { node: block } = el;

        blockStyles.push(block.style);

        if (!block.isEmbed) {
          const { startOffset, endOffset } = el;

          const range = block.createRange(startOffset, endOffset);

          range.forEach(el => {
            inlineStyles.push(el.node.style);
          });
        }
      });

      if (blockStyles.length) {
        let blockStyle = blockStyles.shift();

        blockStyles.forEach(currentStyle => {
          blockStyle = blockStyle.intersect(currentStyle);
        });

        attributes = {
          ...attributes,
          ...blockStyle.toObject()
        };
      }

      if (inlineStyles.length) {
        let inlineStyle = inlineStyles.shift();

        inlineStyles.forEach(currentStyle => {
          inlineStyle = inlineStyle.intersect(currentStyle);
        });

        attributes = {
          ...attributes,
          ...inlineStyle.toObject()
        };
      }
    }

    attributes = {
      ...attributes,
      ...inlineStyleOverride
    };

    return attributes;
  }
}
