import Delta from "quill-delta";
import NodeType from "./NodeType";
import SpecialCharacter from "./SpecialCharacter";
import ParentMixin from "./ParentMixin";
import FormatMixin from "./FormatMixin";
import NodeMixin from "./NodeMixin";
import ListIterator from "./ListIterator";
import findPosition from "./findPosition";
import createRange from "./createRange";
import { addLength, concatText, concatDelta } from "./Reducers";

class Cell {
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
        return NodeType.Cell;
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
                SpecialCharacter.CellStart +
                this.children.reduce(concatText, "");
        }
        return this._text;
    }

    get delta() {
        if (this._delta === null) {
            this._delta = this.children.reduce(
                concatDelta,
                new Delta().insert(
                    SpecialCharacter.CellStart,
                    this.getAttributes()
                )
            );
        }
        return this._delta;
    }

    merge(props) {
        return this.schema.createCell({ ...this, ...props });
    }

    iterator() {
        return new ListIterator(
            [
                this.schema.createCellStart({
                    key: this.key,
                    style: this.style
                })
            ].concat(this.children)
        );
    }

    isValidMark(name) {
        return this.schema.isCellMark(name);
    }

    findChildAtOffset(offset) {
        return findPosition(this.children, offset - 1, false);
    }

    findChildrenAtRange(offset, length) {
        return createRange(this.children, offset - 1, length - 1);
    }

    optimize() {
        return this.children.length === 0
            ? this.setChildren([this.schema.createBlock()])
            : this;
    }
}

export default ParentMixin(FormatMixin(NodeMixin(Cell)));
