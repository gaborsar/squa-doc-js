import Delta from "quill-delta";
import SpecialCharacter from "./SpecialCharacter";
import NodeMixin from "./mixins/Node";
import FormatMixin from "./mixins/Format";
import ParentMixin from "./mixins/Parent";
import ListIterator from "./iterators/ListIterator";
import findPosition from "./traversal/findPosition";
import createRange from "./traversal/createRange";
import Style from "./Style";
import { createKey } from "./Keys";
import { addLength, concatText, concatDelta } from "./Reducers";

class Table {
  constructor({
    schema,
    key = createKey(),
    style = Style.create(),
    children = []
  }) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.children = children;
  }

  // Getters

  getNodeType() {
    return "table";
  }

  getLength() {
    return this.children.reduce(addLength, 2);
  }

  getText() {
    return (
      SpecialCharacter.TableStart +
      this.children.reduce(concatText, "") +
      SpecialCharacter.TableEnd
    );
  }

  getDelta() {
    const delta = new Delta().insert(
      SpecialCharacter.TableStart,
      this.getAttributes()
    );
    return this.children
      .reduce(concatDelta, delta)
      .insert(SpecialCharacter.TableEnd);
  }

  getStart() {
    const { key, style } = this;
    return this.schema.createTableStart({ key, style });
  }

  getEnd() {
    return this.schema.createTableEnd();
  }

  // Node mixin methods

  merge(props) {
    return new Table({ ...this, ...props });
  }

  // Editable mixin methods (required by Document)

  iterator() {
    const start = this.getStart();
    const end = this.getEnd();
    return new ListIterator([start, ...this.children, end]);
  }

  // Format mixin methods

  isValidMark(name) {
    return this.schema.isTableMark(name);
  }

  // Parent mixin methods

  findChildAtOffset(offset) {
    return findPosition(this.children, offset - 1, false);
  }

  findChildrenAtRange(offset, length) {
    return createRange(this.children, offset - 1, length - 1);
  }
}

Object.assign(Table.prototype, NodeMixin, FormatMixin, ParentMixin);

export default Table;
