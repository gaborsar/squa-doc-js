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

      const startOffset = this.offset;
      const sliceLength = Math.min(node.length - startOffset, length);
      const endOffset = startOffset + sliceLength;

      if (callback) {
        callback(new RangeElement(node, startOffset, endOffset));
      }

      if (endOffset === node.length) {
        this.index += 1;
        this.offset = 0;
      } else {
        this.offset += sliceLength;
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
