export default class DocumentIterator {
  constructor(document) {
    this._document = document;
    this._blockIndex = 0;
    this._inlineIndex = 0;
    this._inlineOffset = 0;
  }

  next(length) {
    if (length === 0) {
      return;
    }

    const { children: blocks } = this._document;

    if (this._blockIndex >= blocks.length) {
      return;
    }

    const block = blocks[this._blockIndex];

    if (
      this._inlineIndex === 0 &&
      this._inlineOffset === 0 &&
      block.length <= length
    ) {
      this._blockIndex++;
      return block;
    }

    const { children: inlines } = block;

    if (this._inlineIndex === inlines.length) {
      const slice = block.empty();

      this._blockIndex++;
      this._inlineIndex = 0;
      this._inlineOffset = 0;

      return slice;
    }

    const inline = inlines[this._inlineIndex];

    if (this._inlineOffset === 0 && inline.length <= length) {
      this._inlineIndex++;

      return inline;
    }

    if (inline.length <= this._inlineOffset + length) {
      const slice = inline.slice(this._inlineOffset);

      this._inlineIndex++;
      this._inlineOffset = 0;

      return slice;
    }

    const slice = inline.slice(this._inlineOffset, this._inlineOffset + length);

    this._inlineOffset += length;

    return slice;
  }
}
