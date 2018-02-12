export default class BlockIterator {
  constructor(block) {
    this._block = block;
    this._index = 0;
    this._offset = 0;
  }

  next(length) {
    const { children: nodes } = this._block;

    if (this._index < nodes.length) {
      const node = nodes[this._index];

      if (this._offset === 0 && node.length <= length) {
        this._index++;

        return node;
      }

      if (node.length <= this._offset + length) {
        const slice = node.slice(this._offset);

        this._index++;
        this._offset = 0;

        return slice;
      }

      const slice = node.slice(this._offset, this._offset + length);

      this._offset += length;

      return slice;
    }
  }
}
