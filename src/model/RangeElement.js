"use strict";

export default class RangeElement {
  constructor(node, startOffset, endOffset) {
    this.node = node;
    this.startOffset = startOffset;
    this.endOffset = endOffset;
  }

  get isPartial() {
    return this.startOffset > 0 || this.endOffset < this.node.length;
  }
}
