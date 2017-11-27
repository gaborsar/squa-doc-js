"use strict";

import Schema from "./Schema";
import Style from "./Style";
import Text from "./Text";
import Embed from "./Embed";
import createKey from "./utils/createKey";
import nodeMixin from "./mixins/node";
import parentMixin from "./mixins/parent";
import formatMixin from "./mixins/format";

export const EOL = "\n";

export default class Block {
  static create(props = {}) {
    const {
      schema = new Schema(),
      key = createKey(),
      style = Style.create(),
      children = []
    } = props;
    return new Block(schema, key, style, children);
  }

  constructor(schema, key, style, children) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.children = children;
  }

  merge(props) {
    return Block.create(
      Object.assign(
        {
          schema: this.schema,
          key: this.key,
          style: this.style,
          children: this.children
        },
        props
      )
    );
  }

  get length() {
    return this.children.reduce(
      (length, child) => length + child.length,
      EOL.length
    );
  }

  get text() {
    return this.children.reduce((text, child) => text + child.text, "") + EOL;
  }

  toJSON() {
    return {
      style: this.style.toJSON(),
      children: this.children.map(child => child.toJSON())
    };
  }

  format(attributes) {
    const style = this.style.format(attributes, type =>
      this.schema.isBlockMark(type)
    );

    return this.setStyle(style);
  }

  formatAt(offset, length, attributes) {
    let node = this;

    if (offset + length === node.length) {
      node = node.format(attributes);
    }

    const range = node.createRange(offset, offset + length);

    range.elements.forEach(element => {
      if (element.isPartial) {
        if (element.node instanceof Text) {
          if (element.startOffset === 0) {
            node = node
              .insertBefore(
                element.node.slice(0, element.endOffset).format(attributes),
                element.node
              )
              .replaceChild(
                element.node.slice(element.endOffset, element.node.length),
                element.node
              );
          } else if (element.endOffset === element.node.length) {
            node = node
              .insertBefore(
                element.node.slice(0, element.startOffset),
                element.node
              )
              .replaceChild(
                element.node
                  .slice(element.startOffset, element.node.length)
                  .format(attributes),
                element.node
              );
          } else {
            node = node
              .insertBefore(
                element.node.slice(0, element.startOffset),
                element.node
              )
              .insertBefore(
                element.node
                  .slice(element.startOffset, element.endOffset)
                  .format(attributes),
                element.node
              )
              .replaceChild(
                element.node.slice(element.endOffset, element.node.length),
                element.node
              );
          }
        }
      } else {
        node = node.replaceChild(element.node.format(attributes), element.node);
      }
    });

    return node;
  }

  insertAt(offset, value, attributes) {
    let node = this;

    let child;

    if (typeof value === "string") {
      child = Text.create({
        schema: node.schema,
        value
      });
    } else if (node.schema.isInlineEmbed(Embed.type(value))) {
      child = Embed.create({
        schema: node.schema,
        value
      });
    }

    if (child) {
      child = child.format(attributes);

      const position = node.createPosition(offset);

      if (position) {
        if (position.offset === 0) {
          node = node.insertBefore(child, position.node);
        } else {
          if (position.node instanceof Text) {
            node = node
              .insertBefore(
                position.node.slice(0, position.offset),
                position.node
              )
              .insertBefore(child, position.node)
              .replaceChild(
                position.node.slice(position.offset, position.node.length),
                position.node
              );
          }
        }
      } else {
        node = node.appendChild(child);
      }
    }

    return node;
  }

  deleteAt(offset, length) {
    let node = this;

    const range = node.createRange(offset, offset + length);

    range.elements.forEach(element => {
      if (element.isPartial) {
        if (element.node instanceof Text) {
          if (element.startOffset > 0) {
            node = node.insertBefore(
              element.node.slice(0, element.startOffset),
              element.node
            );
          }
          if (element.endOffset < element.node.length) {
            node = node.insertBefore(
              element.node.slice(element.endOffset, element.node.length),
              element.node
            );
          }
        }
      }

      node = node.removeChild(element.node);
    });

    return node;
  }

  normalize() {
    let node = this;

    const children = [];

    node.children.forEach(child => {
      if (child instanceof Text && children.length) {
        const previousChild = children[children.length - 1];

        if (
          previousChild instanceof Text &&
          previousChild.style === child.style
        ) {
          children[children.length - 1] = previousChild.concat(child);
          return;
        }
      }

      children.push(child);
    });

    if (node.children.length !== children.length) {
      node = node.setChildren(children);
    }

    return node;
  }

  slice(startOffset, endOffset) {
    let node = this;

    node = node.regenerateKey();

    if (endOffset < node.length - EOL.length) {
      node = node.deleteAt(endOffset, node.length - EOL.length - endOffset);
    }

    if (startOffset > 0) {
      node = node.deleteAt(0, startOffset);
    }

    return node;
  }

  concat(other) {
    return other.setChildren(this.children.concat(other.children));
  }
}

nodeMixin(Block);
parentMixin(Block);
formatMixin(Block);
