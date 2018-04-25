import NodeMixin from "./mixins/Node";
import FormatMixin from "./mixins/Format";
import AtomicIterator from "./iterators/AtomicIterator";
import Style from "./Style";
import { createKey } from "./Keys";

class TableRowStart {
  constructor({ schema, key = createKey(), style = Style.create() }) {
    this.schema = schema;
    this.key = key;
    this.style = style;
  }

  // Getters

  getNodeType() {
    return "table-row-start";
  }

  getLength() {
    return 1;
  }

  // Node mixin methods

  merge(props) {
    return new TableRowStart({ ...this, ...props });
  }

  // Editable mixin methods (reqired by Document)

  iterator() {
    return new AtomicIterator(this);
  }

  // Format mixin methods

  isValidMark(name) {
    return this.schema.isTableRowMark(name);
  }
}

Object.assign(TableRowStart.prototype, NodeMixin, FormatMixin);

export default TableRowStart;
