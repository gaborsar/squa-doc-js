import DocumentIterator from "./DocumentIterator";
import Text from "./Text";
import Embed from "./Embed";
import Block from "./Block";
import { EOL } from "../constants";

export default class DocumentEditor {
  constructor(document) {
    this.document = document;
    this.iterator = new DocumentIterator(document);
    this.blocks = [];
    this.inlines = [];
  }

  retainBlock(node) {
    node = node.prependChildren(this.inlines);

    this.blocks.push(node);
    this.inlines = [];

    return this;
  }

  retainBlockEmbed(node) {
    this.blocks.push(node);
    this.inlines = [];

    return this;
  }

  retainInline(node) {
    this.inlines.push(node);

    return this;
  }

  retain(length) {
    let node;

    if (length !== 0) {
      node = this.iterator.next(length);
    }

    while (length !== 0 && node !== undefined) {
      if (node.isBlock) {
        if (node.isEmbed) {
          this.retainBlockEmbed(node);
        } else {
          this.retainBlock(node);
        }
      } else {
        this.retainInline(node);
      }

      length -= node.length;

      if (length !== 0) {
        node = this.iterator.next(length);
      }
    }

    return this;
  }

  formatAndPushBlock(node, attributes) {
    node = node
      .format(attributes)
      .setChildren(node.children.map(child => child.format(attributes)));

    node = node.prependChildren(this.inlines);

    this.blocks.push(node);
    this.inlines = [];

    return this;
  }

  formatAndPushBlockEmbed(node, attributes) {
    node = node.format(attributes);

    this.blocks.push(node);
    this.inlines = [];

    return this;
  }

  formatAndPushInline(node, attributes) {
    node = node.format(attributes);

    this.inlines.push(node);

    return this;
  }

  format(length, attributes) {
    let node;

    if (length !== 0) {
      node = this.iterator.next(length);
    }

    while (length !== 0 && node !== undefined) {
      if (node.isBlock) {
        if (node.isEmbed) {
          this.formatAndPushBlockEmbed(node, attributes);
        } else {
          this.formatAndPushBlock(node, attributes);
        }
      } else {
        this.formatAndPushInline(node, attributes);
      }

      length -= node.length;

      if (length !== 0) {
        node = this.iterator.next(length);
      }
    }

    return this;
  }

  insertBlock(attributes) {
    const { schema } = this.document;

    const block = Block.create({ schema, children: this.inlines }).format(attributes);

    this.blocks.push(block);
    this.inlines = [];

    return this;
  }

  insertBlockEmbed(value, attributes) {
    const { schema } = this.document;

    const node = Embed.create({ schema, value }).format(attributes);

    this.blocks.push(node);
    this.inlines = [];

    return this;
  }

  insertText(value, attributes) {
    const { schema } = this.document;

    const node = Text.create({ schema, value }).format(attributes);

    this.inlines.push(node);

    return this;
  }

  insertInlineEmbed(value, attributes) {
    const { schema } = this.document;

    const node = Embed.create({ schema, value }).format(attributes);

    this.inlines.push(node);

    return this;
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      const lines = value.split(EOL);
      let line = lines.shift();

      if (line.length !== 0) {
        this.insertText(line, attributes);
      }

      while (lines.length !== 0) {
        this.insertBlock(attributes);

        line = lines.shift();

        if (line.length !== 0) {
          this.insertText(line, attributes);
        }
      }

      return this;
    }

    if (typeof value === "object") {
      const { schema } = this.document;

      const type = Embed.type(value);

      if (schema.isBlockEmbed(type)) {
        return this.insertBlockEmbed(value, attributes);
      }

      if (schema.isInlineEmbed(type)) {
        return this.insertInlineEmbed(value, attributes);
      }
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
    return this.document.setChildren(this.blocks);
  }
}
