"use strict";

import RangeElement from "./RangeElement";
import Range from "./Range";

export default class RangeBuilder {
  constructor(nodes) {
    this.nodes = nodes;
    this.index = 0;
    this.offset = 0;
    this.elements = [];
  }

  next(length, callback) {
    while (this.index < this.nodes.length && length) {
      const node = this.nodes[this.index];
      const sliceLength = Math.min(node.length - this.offset, length);
      const nextOffset = this.offset + sliceLength;
      if (callback) {
        callback(new RangeElement(node, this.offset, nextOffset));
      }
      this.offset = nextOffset;
      if (this.offset === node.length) {
        this.index += 1;
        this.offset = 0;
      }
      length -= sliceLength;
    }
    return this;
  }

  skip(length) {
    return this.next(length);
  }

  keep(length) {
    return this.next(length, element => {
      this.elements.push(element);
    });
  }

  build() {
    return new Range(this.elements);
  }
}
