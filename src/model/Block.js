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
    return this.setStyle(
      this.style.format(attributes, type => this.schema.isBlockMark(type))
    );
  }

  formatAt(offset, length, attributes) {
    let node = this;

    if (offset + length === node.length) {
      node = node.format(attributes);
    }

    const range = node.createRange(offset, offset + length);

    range.elements.forEach(element => {
      const child = element.node;

      if (element.isPartial) {
        if (child instanceof Text) {
          if (element.startOffset === 0) {
            node = node
              .insertBefore(
                child.slice(0, element.endOffset).format(attributes),
                child
              )
              .replaceChild(
                child.slice(element.endOffset, child.length),
                child
              );
          } else if (element.endOffset === child.length) {
            node = node
              .insertBefore(child.slice(0, element.startOffset), child)
              .replaceChild(
                child
                  .slice(element.startOffset, child.length)
                  .format(attributes),
                child
              );
          } else {
            node = node
              .insertBefore(child.slice(0, element.startOffset), child)
              .insertBefore(
                child
                  .slice(element.startOffset, element.endOffset)
                  .format(attributes),
                child
              )
              .replaceChild(
                child.slice(element.endOffset, child.length),
                child
              );
          }
        }
      } else {
        node = node.replaceChild(child.format(attributes), child);
      }
    });

    return node;
  }

  insertAt(offset, value, attributes) {
    let node = this;

    let newChild;

    if (typeof value === "string") {
      newChild = Text.create({
        schema: node.schema,
        value
      });
    } else if (node.schema.isInlineEmbed(Embed.type(value))) {
      newChild = Embed.create({
        schema: node.schema,
        value
      });
    }

    if (newChild) {
      newChild = newChild.format(attributes);

      const position = node.createPosition(offset);

      if (position) {
        const child = position.node;

        if (position.offset === 0) {
          node = node.insertBefore(newChild, child);
        } else {
          if (child instanceof Text) {
            node = node
              .insertBefore(child.slice(0, position.offset), child)
              .insertBefore(newChild, child)
              .replaceChild(child.slice(position.offset, child.length), child);
          }
        }
      } else {
        node = node.appendChild(newChild);
      }
    }

    return node;
  }

  deleteAt(offset, length) {
    let node = this;

    const range = node.createRange(offset, offset + length);

    range.elements.forEach(element => {
      const child = element.node;

      if (element.isPartial) {
        if (child instanceof Text) {
          if (element.startOffset > 0) {
            node = node.insertBefore(
              child.slice(0, element.startOffset),
              child
            );
          }
          if (element.endOffset < child.length) {
            node = node.insertBefore(
              child.slice(element.endOffset, child.length),
              child
            );
          }
        }
      }

      node = node.removeChild(child);
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
