"use strict";

import Schema from "./Schema";
import Embed from "./Embed";
import Block, { EOL } from "./Block";
import createKey from "./utils/createKey";
import nodeMixin from "./mixins/node";
import parentMixin from "./mixins/parent";

export default class Document {
  static create(props = {}) {
    const { schema = new Schema(), key = createKey(), children = [] } = props;
    return new Document(schema, key, children);
  }

  constructor(schema, key, children) {
    this.schema = schema;
    this.key = key;
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

  formatAt(offset, length, attributes) {
    let node = this;

    const range = node.createRange(offset, offset + length);

    range.elements.forEach(el => {
      node = node.replaceChild(
        el.node.formatAt(el.startOffset, el.length, attributes),
        el.node
      );
    });

    return node;
  }

  insertAt(offset, value, attributes) {
    let node = this;

    const pos = node.createPosition(offset);

    if (!pos) {
      return node;
    }

    if (typeof value === "string") {
      let fragment = [];

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

      fragment = fragment.map(child => child.normalize());

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
        const child = pos.node
          .insertAt(pos.offset, value, attributes)
          .normalize();

        const children = node.children
          .slice(0, pos.index)
          .concat(child)
          .concat(node.children.slice(pos.index + 1));

        node = node.setChildren(children);
      }
    }

    return node;
  }

  deleteAt(offset, length) {
    const node = this;

    const startPos = node.createPosition(offset);

    if (!startPos) {
      return node;
    }

    const endPos = node.createPosition(offset + length);

    if (!endPos) {
      return node;
    }

    let fragment = [];

    if (startPos.index === endPos.index) {
      fragment.push(
        startPos.node.deleteAt(startPos.offset, endPos.offset - startPos.offset)
      );
    } else {
      if (startPos.offset > 0) {
        if (endPos.node instanceof Block) {
          fragment.push(
            startPos.node
              .deleteAt(
                startPos.offset,
                startPos.node.length - startPos.offset - 1
              )
              .concat(endPos.node.deleteAt(0, endPos.offset))
          );
        } else {
          fragment.push(
            startPos.node.deleteAt(
              startPos.offset,
              startPos.node.length - startPos.offset - 1
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

    fragment = fragment.map(child => child.normalize());

    const children = node.children
      .slice(0, startPos.index)
      .concat(fragment)
      .concat(node.children.slice(endPos.index + 1));

    return node.setChildren(children);
  }
}

nodeMixin(Document);
parentMixin(Document);
