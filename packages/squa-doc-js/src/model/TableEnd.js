import AtomicIterator from "./iterators/AtomicIterator";

export default class TableEnd {
  // Getters

  getNodeType() {
    return "table-end";
  }

  getLength() {
    return 1;
  }

  // Editable mixin methods (required by Document)

  iterator() {
    return new AtomicIterator(this);
  }
}
