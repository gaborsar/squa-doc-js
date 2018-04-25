export default class TextIterator {
  constructor(node) {
    this.node = node;
    this.offset = 0;
  }

  isDone() {
    return this.node.getLength() <= this.offset;
  }

  next(length) {
    const { node } = this;
    const nodeLength = node.getLength();

    if (nodeLength <= this.offset) {
      return null;
    }

    const nextOffset = Math.min(nodeLength, this.offset + length);

    let slice;

    if (this.offset === 0 && nextOffset === nodeLength) {
      slice = node;
    } else {
      slice = node.slice(this.offset, nextOffset);
    }

    this.offset = nextOffset;

    return slice;
  }
}
