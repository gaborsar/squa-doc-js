"use strict";

import Schema from "./Schema";
import Embed from "./Embed";
import Node from "./Node";
import Block, { EOL } from "./Block";
import ParentMixin from "./mixins/Parent";
import createKey from "./utils/createKey";

export default class Document extends ParentMixin(Node) {
  static create(props = {}) {
    const { schema = new Schema(), key = createKey(), children = [] } = props;
    return new Document(schema, key, children);
  }

  constructor(schema, key, children) {
    super(schema, key);
    this.children = children;
  }

  merge(props) {
    return Document.create(
      Object.assign(
        {
          schema: this.schema,
          key: this.key,
          children: this.children
        },
        props
      )
    );
  }

  get length() {
    return this.children.reduce((length, child) => length + child.length, 0);
  }

  get text() {
    return this.children.reduce((text, child) => text + child.text, "");
  }

  toJSON() {
    return {
      children: this.children.map(child => child.toJSON())
    };
  }

  formatAt(startOffset, endOffset, attributes) {
    let node = this;

    const range = node.createRange(startOffset, endOffset);

    range.elements.forEach(el => {
      node = node.replaceChild(
        el.node.formatAt(el.startOffset, el.endOffset, attributes),
        el.node
      );
    });

    return node;
  }

  // @todo (gabor) clean
  // @todo (gabor) update to use parent methods

  insertAt(offset, value, attributes) {
    let node = this;

    const pos = node.createPosition(offset);

    if (!pos) {
      return node;
    }

    if (typeof value === "string") {
      const fragment = [];

      let { offset } = pos;
      let child = pos.node;

      const lines = value.split(EOL);
      let line = lines.shift();

      if (line.length) {
        child = child.insertAt(offset, line, attributes);
      }

      while (lines.length) {
        offset += line.length;

        const leftSlice = child
          .slice(0, offset)
          .clearStyle()
          .format(attributes);

        fragment.push(leftSlice);

        child = child.slice(offset, child.length - 1);

        offset = 0;

        line = lines.shift();

        if (line.length) {
          child = child.insertAt(offset, line, attributes);
        }
      }

      fragment.push(child);

      const children = node.children
        .slice(0, pos.index)
        .concat(fragment)
        .concat(node.children.slice(pos.index + 1));

      node = node.setChildren(children);
    } else {
      const embedType = Embed.type(value);

      if (node.schema.isBlockEmbed(embedType)) {
        if (pos.offset === 0) {
          let child = Embed.create({
            schema: node.schema,
            type: embedType,
            value
          });

          child = child.format(attributes);

          const children = node.children
            .slice(0, pos.index)
            .concat(child)
            .concat(node.children.slice(pos.index));

          node = node.setChildren(children);
        }
      } else if (node.schema.isInlineEmbed(embedType)) {
        const child = pos.node.insertAt(pos.offset, value, attributes);

        const children = node.children
          .slice(0, pos.index)
          .concat(child)
          .concat(node.children.slice(pos.index + 1));

        node = node.setChildren(children);
      }
    }

    return node;
  }

  // @todo (gabor) update to use Range

  deleteAt(startOffset, endOffset) {
    const node = this;

    const startPos = node.createPosition(startOffset);

    if (!startPos) {
      return node;
    }

    const endPos = node.createPosition(endOffset);

    if (!endPos) {
      return node;
    }

    const fragment = [];

    if (startPos.index === endPos.index) {
      fragment.push(startPos.node.deleteAt(startPos.offset, endPos.offset));
    } else {
      if (startPos.offset > 0) {
        if (endPos.node instanceof Block) {
          fragment.push(
            startPos.node
              .deleteAt(startPos.offset, startPos.node.length - EOL.length)
              .concat(endPos.node.deleteAt(0, endPos.offset))
          );
        } else {
          fragment.push(
            startPos.node.deleteAt(
              startPos.offset,
              startPos.node.length - EOL.length
            )
          );
        }
      } else {
        if (endPos.offset === 0) {
          fragment.push(endPos.node);
        } else if (endPos.offset < endPos.node.length) {
          fragment.push(endPos.node.deleteAt(0, endPos.offset));
        }
      }
    }

    const children = node.children
      .slice(0, startPos.index)
      .concat(fragment)
      .concat(node.children.slice(endPos.index + 1));

    return node.setChildren(children);
  }
}
