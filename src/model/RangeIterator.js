import RangeElement from "./RangeElement";

const sink = () => {};

export default class RangeIterator {
  constructor(nodes) {
    this._nodes = nodes;
    this._index = 0;
    this._offset = 0;
  }

  next(length, callback = sink) {
    while (this._index < this._nodes.length && length) {
      const node = this._nodes[this._index];

      const sliceLength = Math.min(node.length - this._offset, length);
      const nextOffset = this._offset + sliceLength;

      callback(new RangeElement(node, this._offset, nextOffset));

      if (nextOffset < node.length) {
        this._offset = nextOffset;
      } else {
        this._index += 1;
        this._offset = 0;
      }

      length -= sliceLength;
    }

    return this;
  }
}
