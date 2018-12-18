import Delta from "quill-delta";
import NodeType from "./NodeType";
import Editor from "./Editor";
import NodeMixin from "./NodeMixin";
import ParentMixin from "./ParentMixin";
import EditableMixin from "./EditableMixin";
import ListIterator from "./ListIterator";
import findPosition from "./findPosition";
import createRange from "./createRange";
import fastDiff from "./fastDiff";
import applyMixins from "./applyMixins";
import { isBlockNode } from "./Predicates";
import { addLength, concatText, concatDelta } from "./Reducers";

export default class Document {
    _length = 0;
    _text = "";
    _delta = null;

    constructor(schema, key, children) {
        this.schema = schema;
        this.key = key;
        this.children = children;
    }

    get type() {
        return NodeType.Document;
    }

    get length() {
        if (this._length === 0) {
            this._length = this.children.reduce(addLength, 0);
        }
        return this._length;
    }

    get text() {
        if (this._text === "") {
            this._text = this.children.reduce(concatText, "");
        }
        return this._text;
    }

    get delta() {
        if (this._delta === null) {
            this._delta = this.children.reduce(concatDelta, new Delta());
        }
        return this._delta;
    }

    get isPristine() {
        const { children } = this;
        if (children.length !== 1) {
            return false;
        }
        const child = children[0];
        return isBlockNode(child) && child.isEmpty && child.isPristine;
    }

    merge(props) {
        return this.schema.createDocument({ ...this, ...props });
    }

    iterator() {
        return new ListIterator(this.children);
    }

    editor() {
        return new Editor(
            this.iterator(),
            this.schema.createDocumentBuilder({
                key: this.key
            })
        );
    }

    findChildAtOffset(offset) {
        return findPosition(this.children, offset, false);
    }

    findChildrenAtRange(offset, length) {
        return createRange(this.children, offset, length);
    }

    optimize() {
        return this.children.length === 0
            ? this.setChildren([this.schema.createBlock()])
            : this;
    }

    diff(other) {
        return fastDiff(this.children, other.children);
    }
}

applyMixins(Document, NodeMixin, ParentMixin, EditableMixin);
