import Delta from "quill-delta";
import EditorMode from "./EditorMode";
import SpecialCharacter from "./SpecialCharacter";
import Schema from "./Schema";
import Selection from "./Selection";
import Change from "./Change";
import List from "./List";
import parseHTML from "../parser/parseHTML";
import defaultSchema from "../defaults/schema";
import defaultTokenizeNode from "../defaults/tokenizeNode";
import defaultTokenizeClassName from "../defaults/tokenizeClassName";
import { isBlockLevelNode, isInlineNode } from "./Predicates";

export default class Value {
    static fromDelta({ schema = defaultSchema, contents }) {
        const builder = new Schema(schema).createDocumentBuilder();

        contents.forEach(op => {
            builder.insert(op.insert, op.attributes);
        });

        return new Value({
            document: builder.build()
        });
    }

    static fromJSON({ schema = defaultSchema, contents }) {
        return Value.fromDelta({
            schema,
            contents: new Delta(contents)
        });
    }

    static fromHTML({
        schema = defaultSchema,
        contents,
        tokenizeNode = defaultTokenizeNode,
        tokenizeClassName = defaultTokenizeClassName
    }) {
        return Value.fromDelta({
            schema,
            contents: parseHTML(contents, tokenizeNode, tokenizeClassName)
        });
    }

    static createEmpty({ schema = defaultSchema } = {}) {
        return Value.fromDelta({
            schema,
            delta: new Delta().insert(SpecialCharacter.BlockEnd)
        });
    }

    constructor({
        mode = EditorMode.Edit,
        document,
        selection = new Selection(),
        undoStack = new List(),
        redoStack = new List(),
        inlineStyleOverride = null
    }) {
        this.mode = mode;
        this.document = document;
        this.selection = selection;
        this.undoStack = undoStack;
        this.redoStack = redoStack;
        this.inlineStyleOverride = inlineStyleOverride;
    }

    merge(props) {
        return new Value({ ...this, ...props });
    }

    get isComposing() {
        return this.mode === EditorMode.Compose;
    }

    get isEditing() {
        return this.mode === EditorMode.Edit;
    }

    get canUndo() {
        return !this.undoStack.isEmpty;
    }

    get canRedo() {
        return !this.redoStack.isEmpty;
    }

    get hasInlineStyleOverride() {
        return this.inlineStyleOverride !== null;
    }

    setMode(mode) {
        return this.merge({ mode });
    }

    setDocument(document) {
        return this.merge({ document, inlineStyleOverride: null });
    }

    setSelection(selection) {
        return this.merge({ selection, inlineStyleOverride: null });
    }

    setUndoStack(undoStack) {
        return this.merge({ undoStack });
    }

    setRedoStack(redoStack) {
        return this.merge({ redoStack });
    }

    setInlineStyleOverride(inlineStyleOverride) {
        return this.merge({ inlineStyleOverride });
    }

    toDelta() {
        return this.document.delta;
    }

    toJSON() {
        return this.document.delta.ops;
    }

    change() {
        return new Change(this);
    }

    getAttributes() {
        return {
            ...this.getBlockAttributes(),
            ...this.getInlineAttributes()
        };
    }

    getBlockAttributes() {
        const { document, selection } = this;
        return selection.isCollapsed
            ? document.getAttributesAtOffset(selection.offset, isBlockLevelNode)
            : document.getAttributesAtRange(
                  selection.offset,
                  selection.length,
                  isBlockLevelNode
              );
    }

    getInlineAttributes() {
        const { document, selection, inlineStyleOverride } = this;
        return selection.isCollapsed
            ? document.getAttributesAtOffset(
                  selection.offset,
                  isInlineNode,
                  inlineStyleOverride
              )
            : document.getAttributesAtRange(
                  selection.offset,
                  selection.length,
                  isInlineNode,
                  inlineStyleOverride
              );
    }
}
