import BlockIterator from "./BlockIterator";
import Text from "./Text";
import Embed from "./Embed";

export default class BlockEditor {
  constructor(block) {
    this._block = block;
    this._iterator = new BlockIterator(block);
    this._nodes = [];
  }

  retain(length) {
    while (length) {
      const node = this._iterator.next(length);

      if (!node) {
        break;
      }

      this._nodes.push(node);

      length -= node.length;
    }

    return this;
  }

  format(length, attributes) {
    while (length) {
      let node = this._iterator.next(length);

      if (!node) {
        break;
      }

      node = node.format(attributes);

      this._nodes.push(node);

      length -= node.length;
    }

    return this;
  }

  _insertText(value, attributes) {
    const { schema } = this._block;

    const node = Text.create({ schema, value }).format(attributes);

    this._nodes.push(node);

    return this;
  }

  _insertEmbed(value, attributes) {
    const { schema } = this._block;

    const node = Embed.create({ schema, value }).format(attributes);

    this._nodes.push(node);

    return this;
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      return this._insertText(value, attributes);
    }

    if (typeof value === "object") {
      const { schema } = this._block;

      const type = Embed.type(value);

      if (schema.isInlineEmbed(type)) {
        return this._insertEmbed(value, attributes);
      }

      throw new Error(`Invalid embed type: ${type}`);
    }

    throw new Error(`Invalid value: ${value}`);
  }

  delete(length) {
    while (length) {
      const node = this._iterator.next(length);

      if (!node) {
        break;
      }

      length -= node.length;
    }

    return this;
  }

  apply(delta) {
    delta.forEach(op => {
      if (typeof op.retain === "number") {
        if (op.attributes) {
          this.format(op.retain, op.attributes);
        } else {
          this.retain(op.retain);
        }
      } else if (
        typeof op.insert === "string" ||
        typeof op.insert === "object"
      ) {
        this.insert(op.insert, op.attributes);
      } else if (typeof op.delete === "number") {
        this.delete(op.delete);
      }
    });

    return this;
  }

  build() {
    this.retain(Infinity);

    return this._block.setChildren(this._nodes).normalize();
  }
}
