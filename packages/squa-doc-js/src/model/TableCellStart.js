import NodeMixin from "./mixins/Node";
import FormatMixin from "./mixins/Format";
import AtomicIterator from "./iterators/AtomicIterator";
import Style from "./Style";
import { createKey } from "./Keys";

class TableCellStart {
  constructor({ schema, key = createKey(), style = Style.create() }) {
    this.schema = schema;
    this.key = key;
    this.style = style;
  }

  // Getters

  getNodeType() {
    return "table-cell-start";
  }

  getLength() {
    return 1;
  }

  // Node mixin methods

  merge(props) {
    return new TableCellStart({ ...this, ...props });
  }

  // Editable mixin methods (required by Document)

  iterator() {
    return new AtomicIterator(this);
  }

  // Format mixin methods

  isValidMark(name) {
    return this.schema.isTableCellMark(name);
  }
}

Object.assign(TableCellStart.prototype, NodeMixin, FormatMixin);

export default TableCellStart;
