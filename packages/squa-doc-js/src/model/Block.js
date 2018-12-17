import Delta from "quill-delta";
import NodeType from "./NodeType";
import SpecialCharacter from "./SpecialCharacter";
import EditableMixin from "./EditableMixin";
import ParentMixin from "./ParentMixin";
import FormatMixin from "./FormatMixin";
import NodeMixin from "./NodeMixin";
import ListIterator from "./ListIterator";
import Editor from "./Editor";
import findPosition from "./findPosition";
import createRange from "./createRange";
import { addLength, concatText, concatDelta } from "./Reducers";

class Block {
    _length = 0;
    _text = "";
    _delta = null;

    constructor(schema, key, style, children) {
        this.schema = schema;
        this.key = key;
        this.style = style;
        this.children = children;
    }

    get type() {
        return NodeType.Block;
    }

    get length() {
        if (this._length === 0) {
            this._length = this.children.reduce(addLength, 1);
        }
        return this._length;
    }

    get text() {
        if (this._text === "") {
            this._text =
                this.children.reduce(concatText, "") +
                SpecialCharacter.BlockEnd;
        }
        return this._text;
    }

    get delta() {
        if (this._delta === null) {
            this._delta = this.children
                .reduce(concatDelta, new Delta())
                .insert(SpecialCharacter.BlockEnd, this.getAttributes());
        }
        return this._delta;
    }

    get isEmpty() {
        return this.children.length === 0;
    }

    merge(props) {
        return this.schema.createBlock({ ...this, ...props });
    }

    iterator() {
        return new ListIterator(
            this.children.concat(
                this.schema.createBlockEnd({
                    key: this.key,
                    style: this.style
                })
            )
        );
    }

    editor() {
        return new Editor(
            new ListIterator(this.children),
            this.schema.createBlockBuilder({
                key: this.key,
                style: this.style
            })
        );
    }

    isValidMark(name) {
        return this.schema.isBlockMark(name);
    }

    findChildAtOffset(offset) {
        return findPosition(this.children, offset, true);
    }

    findChildrenAtRange(offset, length) {
        return createRange(this.children, offset, length);
    }

    concat(other) {
        return other.setChildren(this.children.concat(other.children));
    }

    optimize() {
        const children = this.children.slice();

        for (let i = children.length - 1; i > 0; i--) {
            const childA = children[i - 1];
            const childB = children[i];

            if (
                childA.type === NodeType.Text &&
                childB.type === NodeType.Text &&
                childA.style === childB.style
            ) {
                children.splice(i - 1, 2, childA.concat(childB));
            }
        }

        if (children.length === this.children.length) {
            return this;
        }

        return this.merge({ children });
    }
}

export default EditableMixin(ParentMixin(FormatMixin(NodeMixin(Block))));
