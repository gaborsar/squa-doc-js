export default class RangeElement {
  constructor(node, startOffset, endOffset) {
    this.node = node;
    this.startOffset = startOffset;
    this.endOffset = endOffset;
  }

  get length() {
    return this.endOffset - this.startOffset;
  }

  get isPartial() {
    return this.length !== this.node.length;
  }
}
