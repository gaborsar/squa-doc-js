import DocumentIterator from "./DocumentIterator";
import Text from "./Text";
import Embed from "./Embed";
import Block from "./Block";
import { EOL } from "../constants";

export default class DocumentEditor {
  constructor(document) {
    this._document = document;
    this._iterator = new DocumentIterator(document);
    this._blocks = [];
    this._inlines = [];
  }

  _retainBlock(node) {
    node = node.prependChildren(this._inlines);

    this._blocks.push(node);
    this._inlines = [];

    return this;
  }

  _retainBlockEmbed(node) {
    if (this._inlines.length) {
      throw new Error(`Invalid embed type: ${node.type}`);
    }

    this._blocks.push(node);

    return this;
  }

  _retainInline(node) {
    this._inlines.push(node);
    return this;
  }

  retain(length) {
    let node = this._iterator.next(length);

    while (length && node) {
      if (node.isBlock) {
        if (node.isEmbed) {
          this._retainBlockEmbed(node);
        } else {
          this._retainBlock(node);
        }
      } else {
        this._retainInline(node);
      }

      length -= node.length;

      node = this._iterator.next(length);
    }

    return this;
  }

  _formatAndPushBlock(node, attributes) {
    node = node
      .format(attributes)
      .setChildren(node.children.map(child => child.format(attributes)));

    node = node.prependChildren(this._inlines);

    this._blocks.push(node);
    this._inlines = [];

    return this;
  }

  _formatAndPushBlockEmbed(node, attributes) {
    if (this._inlines.length) {
      throw new Error(`Invalid embed type: ${node.type}`);
    }

    node = node.format(attributes);

    this._blocks.push(node);

    return this;
  }

  _formatAndPushInline(node, attributes) {
    node = node.format(attributes);

    this._inlines.push(node);

    return this;
  }

  format(length, attributes) {
    let node = this._iterator.next(length);

    while (length && node) {
      if (node.isBlock) {
        if (node.isEmbed) {
          this._formatAndPushBlockEmbed(node, attributes);
        } else {
          this._formatAndPushBlock(node, attributes);
        }
      } else {
        this._formatAndPushInline(node, attributes);
      }

      length -= node.length;

      node = this._iterator.next(length);
    }

    return this;
  }

  _insertBlock(attributes) {
    const { _document: { schema }, _inlines: children } = this;

    const block = Block.create({ schema, children }).format(attributes);

    this._blocks.push(block);
    this._inlines = [];

    return this;
  }

  _insertBlockEmbed(value, attributes) {
    const { schema } = this._document;

    const type = Embed.type(value);

    if (this._inlines.length) {
      throw new Error(`Invalid embed type: ${type}`);
    }

    const node = Embed.create({ schema, value }).format(attributes);

    this._blocks.push(node);

    return this;
  }

  _insertText(value, attributes) {
    const { schema } = this._document;

    const node = Text.create({ schema, value }).format(attributes);

    this._inlines.push(node);

    return this;
  }

  _insertInlineEmbed(value, attributes) {
    const { schema } = this._document;

    const node = Embed.create({ schema, value }).format(attributes);

    this._inlines.push(node);

    return this;
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      const lines = value.split(EOL);
      let line = lines.shift();

      if (line.length) {
        this._insertText(line, attributes);
      }

      while (lines.length) {
        this._insertBlock(attributes);
        line = lines.shift();

        if (line.length) {
          this._insertText(line, attributes);
        }
      }

      return this;
    }

    if (typeof value === "object") {
      const { schema } = this._document;
      const type = Embed.type(value);

      if (schema.isBlockEmbed(type)) {
        return this._insertBlockEmbed(value, attributes);
      }

      if (schema.isInlineEmbed(type)) {
        return this._insertInlineEmbed(value, attributes);
      }

      throw new Error(`Invalid embed type: ${type}`);
    }

    throw new Error(`Invalid value: ${value}`);
  }

  delete(length) {
    let node = this._iterator.next(length);

    while (length && node) {
      length -= node.length;

      node = this._iterator.next(length);
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
    return this._document.setChildren(this._blocks);
  }
}
