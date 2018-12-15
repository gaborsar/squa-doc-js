import Delta from "quill-delta";
import EditorMode from "./EditorMode";
import SpecialCharacter from "./SpecialCharacter";
import Schema from "./Schema";
import Selection from "./Selection";
import Change from "./Change";
import List from "./List";
import parseHTML from "../parser/parseHTML";
import defaultSchema from "../defaults/schema";
import { isBlockLevelNode, isInlineNode } from "./Predicates";

export default class Value {
    static fromDelta({ schema = defaultSchema, delta }) {
        const builder = new Schema(schema).createDocumentBuilder();

        delta.forEach(op => {
            builder.insert(op.insert, op.attributes);
        });

        return new Value({
            document: builder.build()
        });
    }

    static fromJSON({ schema = defaultSchema, contents }) {
        return Value.fromDelta({
            schema,
            delta: new Delta(contents)
        });
    }

    static fromHTML({
        schema = defaultSchema,
        contents,
        tokenizeNode,
        tokenizeClassName
    }) {
        return Value.fromDelta({
            schema,
            delta: parseHTML(contents, tokenizeNode, tokenizeClassName)
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

    getMode() {
        return this.mode;
    }

    getDocument() {
        return this.document;
    }

    getSelection() {
        return this.selection;
    }

    getUndoStack() {
        return this.undoStack;
    }

    getRedoStack() {
        return this.redoStack;
    }

    getInlineStyleOverride() {
        return this.inlineStyleOverride;
    }

    isComposing() {
        return this.mode === EditorMode.Compose;
    }

    isEditing() {
        return this.mode === EditorMode.Edit;
    }

    canUndo() {
        return !this.undoStack.isEmpty();
    }

    canRedo() {
        return !this.redoStack.isEmpty();
    }

    hasInlineStyleOverride() {
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

    getBlockAttributes() {
        const { document, selection } = this;
        return selection.isCollapsed()
            ? document.getAttributesAtOffset(selection.offset, isBlockLevelNode)
            : document.getAttributesAtRange(
                  selection.offset,
                  selection.length,
                  isBlockLevelNode
              );
    }

    getInlineAttributes() {
        const { document, selection, inlineStyleOverride } = this;
        return selection.isCollapsed()
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

    getAttributes() {
        return {
            ...this.getBlockAttributes(),
            ...this.getInlineAttributes()
        };
    }
}
