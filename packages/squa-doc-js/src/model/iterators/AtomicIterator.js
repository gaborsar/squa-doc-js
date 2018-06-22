export default class AtomicIterator {
  constructor(node) {
    this.node = node;
    this.offset = 0;
  }

  isDone() {
    return this.node.getLength() <= this.offset;
  }

  next() {
    const { node } = this;
    const nodeLength = node.getLength();

    if (nodeLength <= this.offset) {
      return null;
    }

    this.offset = nodeLength;

    return node;
  }
}
