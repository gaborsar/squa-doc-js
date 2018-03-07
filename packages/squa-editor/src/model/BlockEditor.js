import BlockIterator from "./BlockIterator";
import Text from "./Text";
import Embed from "./Embed";

export default class BlockEditor {
  constructor(block) {
    this.block = block;
    this.iterator = new BlockIterator(block);
    this.nodes = [];
  }

  retain(length) {
    let node;

    if (length !== 0) {
      node = this.iterator.next(length);
    }

    while (length !== 0 && node !== undefined) {
      this.nodes.push(node);

      length -= node.length;

      if (length !== 0) {
        node = this.iterator.next(length);
      }
    }

    return this;
  }

  format(length, attributes) {
    let node;

    if (length !== 0) {
      node = this.iterator.next(length);
    }

    while (length !== 0 && node !== undefined) {
      node = node.format(attributes);

      this.nodes.push(node);

      length -= node.length;

      if (length !== 0) {
        node = this.iterator.next(length);
      }
    }

    return this;
  }

  insertText(value, attributes) {
    const { schema } = this.block;

    const node = Text.create({ schema, value }).format(attributes);

    this.nodes.push(node);

    return this;
  }

  insertEmbed(value, attributes) {
    const { schema } = this.block;

    const type = Embed.type(value);

    if (schema.isInlineEmbed(type)) {
      const node = Embed.create({ schema, value }).format(attributes);

      this.nodes.push(node);
    }

    return this;
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      return this.insertText(value, attributes);
    }

    if (typeof value === "object") {
      return this.insertEmbed(value, attributes);
    }

    return this;
  }

  delete(length) {
    let node;

    if (length !== 0) {
      node = this.iterator.next(length);
    }

    while (length !== 0 && node !== undefined) {
      length -= node.length;

      if (length !== 0) {
        node = this.iterator.next(length);
      }
    }

    return this;
  }

  apply(delta) {
    delta.forEach(op => {
      if (typeof op.retain === "number") {
        if (typeof op.attributes === "object") {
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
    return this.block.setChildren(this.nodes).normalize();
  }
}
