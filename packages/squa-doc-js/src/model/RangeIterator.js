import RangeElement from "./RangeElement";

const sink = () => {};

export default class RangeIterator {
  constructor(nodes) {
    this.nodes = nodes;
    this.index = 0;
    this.offset = 0;
  }

  next(length, callback = sink) {
    const numberOfNodes = this.nodes.length;

    while (this.index < numberOfNodes && length !== 0) {
      const node = this.nodes[this.index];
      const nodeLength = node.length;

      const sliceLength = Math.min(nodeLength - this.offset, length);
      const nextOffset = this.offset + sliceLength;

      callback(new RangeElement(node, this.offset, nextOffset));

      if (nextOffset < nodeLength) {
        this.offset = nextOffset;
      } else {
        this.index += 1;
        this.offset = 0;
      }

      length -= sliceLength;
    }

    return this;
  }
}
