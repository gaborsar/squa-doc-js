import RangeItem from "./RangeItem";

export default class RangeIterator {
  constructor(nodes) {
    this.nodes = nodes;
    this.index = 0;
    this.offset = 0;
  }

  isDone() {
    return this.nodes.length <= this.index;
  }

  next(length) {
    const { nodes } = this;

    if (nodes.length <= this.index) {
      return null;
    }

    const node = nodes[this.index];
    const nodeLength = node.getLength();

    const maxLength = nodeLength - this.offset;
    const adjustedLength = Math.min(length, maxLength);

    const nextOffset = this.offset + adjustedLength;

    const item = new RangeItem(node, this.index, this.offset, adjustedLength);

    if (nextOffset < nodeLength) {
      this.offset = nextOffset;
    } else {
      this.index++;
      this.offset = 0;
    }

    return item;
  }
}
