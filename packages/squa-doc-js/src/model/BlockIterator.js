export default class BlockIterator {
  constructor(block) {
    this.block = block;
    this.index = 0;
    this.offset = 0;
  }

  next(length) {
    const { children: nodes } = this.block;

    // reached the end

    if (this.index >= nodes.length) {
      return;
    }

    const node = nodes[this.index];

    // return the current node

    if (this.offset === 0 && node.length <= length) {
      this.index++;

      return node;
    }

    // return the end of the current node

    if (node.length <= this.offset + length) {
      const slice = node.slice(this.offset);

      this.index++;
      this.offset = 0;

      return slice;
    }

    // return a slice of the current node

    const nextOffset = this.offset + length;

    const slice = node.slice(this.offset, nextOffset);

    this.offset = nextOffset;

    return slice;
  }
}
