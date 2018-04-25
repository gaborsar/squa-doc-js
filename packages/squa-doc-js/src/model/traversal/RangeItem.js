export default class RangeItem {
  constructor(node, index, offset, length) {
    this.node = node;
    this.index = index;
    this.offset = offset;
    this.length = length;
  }

  getNode() {
    return this.node;
  }

  getIndex() {
    return this.index;
  }

  getOffset() {
    return this.offset;
  }

  getLength() {
    return this.length;
  }
}
