import Delta from "quill-delta";
import NodeType from "./NodeType";
import SpecialCharacter from "./SpecialCharacter";
import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import ParentMixin from "./ParentMixin";
import ListIterator from "./ListIterator";
import findPosition from "./findPosition";
import createRange from "./createRange";
import { addLength, concatText, concatDelta } from "./Reducers";

class Table {
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
        return NodeType.Table;
    }

    get length() {
        if (this._length === 0) {
            this._length = this.children.reduce(addLength, 2);
        }
        return this._length;
    }

    get text() {
        if (this._text === "") {
            this._text =
                SpecialCharacter.TableStart +
                this.children.reduce(concatText, "") +
                SpecialCharacter.TableEnd;
        }
        return this._text;
    }

    get delta() {
        if (this._delta === null) {
            this._delta = this.children
                .reduce(
                    concatDelta,
                    new Delta().insert(
                        SpecialCharacter.TableStart,
                        this.getAttributes()
                    )
                )
                .insert(SpecialCharacter.TableEnd);
        }
        return this._delta;
    }

    getType() {
        return this.type;
    }

    getLength() {
        return this.length;
    }

    getText() {
        return this.text;
    }

    getDelta() {
        return this.delta;
    }

    merge(props) {
        return this.schema.createTable({ ...this, ...props });
    }

    iterator() {
        return new ListIterator(
            [
                this.schema.createTableStart({
                    key: this.key,
                    style: this.style
                })
            ]
                .concat(this.children)
                .concat(this.schema.createTableEnd())
        );
    }

    isValidMark(name) {
        return this.schema.isTableMark(name);
    }

    findChildAtOffset(offset) {
        return findPosition(this.children, offset - 1, false);
    }

    findChildrenAtRange(offset, length) {
        return createRange(this.children, offset - 1, length - 1);
    }

    insertRow(index) {
        const numberOfCells = this.children.reduce(
            (length, row) => Math.max(length, row.children.length),
            0
        );

        const cells = [];
        for (let i = 0; i < numberOfCells; i++) {
            cells.push(this.schema.createCell());
        }

        const row = this.schema.createRow({
            children: cells
        });

        return this.insertChildAtIndex(index, row);
    }

    insertColumn(index) {
        return this.setChildren(
            this.children.map(row =>
                row.insertChildAtIndex(index, this.schema.createCell())
            )
        );
    }

    setRowAttributes(index, attributes) {
        return this.replaceChildAtIndex(
            index,
            this.children[index].setAttributes(attributes)
        );
    }

    setColumnAttributes(index, attributes) {
        return this.setChildren(
            this.children.map(row =>
                row.replaceChildAtIndex(
                    index,
                    row.children[index].setAttributes(attributes)
                )
            )
        );
    }

    deleteRow(index) {
        return this.removeChildAtIndex(index);
    }

    deleteColumn(index) {
        return this.setChildren(
            this.children.map(row => row.removeChildAtIndex(index))
        );
    }

    optimize() {
        return this.children.length === 0
            ? this.setChildren([this.schema.createRow()])
            : this;
    }
}

Object.assign(Table.prototype, NodeMixin, FormatMixin, ParentMixin);

export default Table;
