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

class TableCell {
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
    return "table-cell";
  }

  getLength() {
    return this.children.reduce(addLength, 1);
  }

  getText() {
    return (
      SpecialCharacter.TableCellStart + this.children.reduce(concatText, "")
    );
  }

  getDelta() {
    const delta = new Delta().insert(
      SpecialCharacter.TableCellStart,
      this.getAttributes()
    );
    return this.children.reduce(concatDelta, delta);
  }

  getStart() {
    const { key, style } = this;
    return this.schema.createTableCellStart({ key, style });
  }

  // Node mixin methods

  merge(props) {
    return new TableCell({ ...this, ...props });
  }

  // Editable mixin methods (required by Document)

  iterator() {
    const start = this.getStart();
    return new ListIterator([start, ...this.children]);
  }

  // Format mixin methods

  isValidMark(name) {
    return this.schema.isTableCellMark(name);
  }

  // Parent mixin methods

  findChildAtOffset(offset) {
    return findPosition(this.children, offset - 1, false);
  }

  findChildrenAtRange(offset, length) {
    return createRange(this.children, offset - 1, length - 1);
  }
}

Object.assign(TableCell.prototype, NodeMixin, FormatMixin, ParentMixin);

export default TableCell;
