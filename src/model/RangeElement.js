"use strict";

export default class RangeElement {
  constructor(node, offset, length) {
    this.node = node;
    this.offset = offset;
    this.length = length;
  }

  get isPartial() {
    return this.offset > 0 || this.length < this.node.length;
  }
}
