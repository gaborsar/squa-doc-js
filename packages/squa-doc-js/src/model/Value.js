import Delta from "quill-delta";
import Schema from "./Schema";
import Document from "./Document";
import DocumentBuilder from "./DocumentBuilder";
import Selection from "./Selection";
import Change from "./Change";
import parseHTML from "../parser/parseHTML";
import defaultSchema from "../defaults/schema";
import { EOL, EDITOR_MODE_EDIT } from "../constants";

export default class Value {
  static create(props = {}) {
    return new Value(props);
  }

  static fromDelta(props = {}) {
    const { schema = defaultSchema, contents } = props;

    const builder = new DocumentBuilder(new Schema(schema));

    contents.forEach(op => {
      builder.insert(op.insert, op.attributes);
    });

    const document = builder.build();

    return Value.create({ document });
  }

  static fromJSON(props = {}) {
    const { schema = defaultSchema, contents } = props;

    const delta = new Delta(contents);

    return Value.fromDelta({
      schema,
      contents: delta
    });
  }

  static fromHTML(props = {}) {
    const {
      schema = defaultSchema,
      contents,
      tokenizeNode,
      tokenizeClassName
    } = props;

    const delta = parseHTML(contents, tokenizeNode, tokenizeClassName);

    return Value.fromDelta({
      schema,
      contents: delta
    });
  }

  static createEmpty(props = {}) {
    const { schema = defaultSchema } = props;

    const delta = new Delta().insert(EOL);

    return Value.fromDelta({
      schema,
      contents: delta
    });
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

  get delta() {
    return this.document.delta;
  }

  get contents() {
    return this.delta;
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

      const blockPos = document.findPosition(offset);

      if (blockPos) {
        const { node: block, offset: blockOffset } = blockPos;

        attributes = { ...attributes, ...block.getFormat() };

        if (!block.isEmbed) {
          const inlinePos = block.findPosition(blockOffset, true);

          if (inlinePos) {
            attributes = {
              ...attributes,
              ...inlinePos.node.getFormat()
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

      if (blockStyles.length !== 0) {
        let blockStyle = blockStyles.shift();

        blockStyles.forEach(currentStyle => {
          blockStyle = blockStyle.intersect(currentStyle);
        });

        attributes = {
          ...attributes,
          ...blockStyle.toObject()
        };
      }

      if (inlineStyles.length !== 0) {
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