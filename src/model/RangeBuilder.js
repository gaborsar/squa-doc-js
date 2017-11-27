import RangeElement from "./RangeElement";
import Range from "./Range";

export default class RangeBuilder {
  constructor(nodes) {
    this._nodes = nodes;
    this._index = 0;
    this._offset = 0;
    this._elements = [];
  }

  _next(length, callback) {
    while (this._index < this._nodes.length && length) {
      const node = this._nodes[this._index];

      const sliceLength = Math.min(node.length - this._offset, length);
      const nextOffset = this._offset + sliceLength;

      if (callback) {
        callback(new RangeElement(node, this._offset, nextOffset));
      }

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

  skip(length) {
    return this._next(length);
  }

  keep(length) {
    return this._next(length, element => {
      this._elements.push(element);
    });
  }

  build() {
    return new Range(this._elements);
  }
}
