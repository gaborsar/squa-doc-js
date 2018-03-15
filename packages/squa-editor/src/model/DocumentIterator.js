export default class DocumentIterator {
  constructor(document) {
    this.document = document;
    this.blockIndex = 0;
    this.inlineIndex = 0;
    this.inlineOffset = 0;
  }

  next(length) {
    const { children: blocks } = this.document;

    // reached the end

    if (this.blockIndex >= blocks.length) {
      return;
    }

    const block = blocks[this.blockIndex];

    // return the current block node

    if (
      this.inlineIndex === 0 &&
      this.inlineOffset === 0 &&
      block.length <= length
    ) {
      this.blockIndex++;

      return block;
    }

    const { children: inlines } = block;

    // return the EOL of the current block node

    if (this.inlineIndex === inlines.length) {
      const slice = block.empty();

      this.blockIndex++;

      this.inlineIndex = 0;
      this.inlineOffset = 0;

      return slice;
    }

    const inline = inlines[this.inlineIndex];

    // return the current inline node

    if (this.inlineOffset === 0 && inline.length <= length) {
      this.inlineIndex++;

      return inline;
    }

    // return the end of the current inline node

    if (inline.length <= this.inlineOffset + length) {
      const slice = inline.slice(this.inlineOffset);

      this.inlineIndex++;
      this.inlineOffset = 0;

      return slice;
    }

    // return a slice of the current inline node

    const nextInlineOffset = this.inlineOffset + length;

    const slice = inline.slice(this.inlineOffset, nextInlineOffset);

    this.inlineOffset = nextInlineOffset;

    return slice;
  }
}
