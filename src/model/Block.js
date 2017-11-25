"use strict";

import Schema from "./Schema";
import Style from "./Style";
import Text from "./Text";
import Embed from "./Embed";
import Position from "./Position";
import createKey from "./createKey";

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

  setKey(key) {
    return new Block(this.schema, key, this.style, this.children);
  }

  setStyle(style) {
    return new Block(this.schema, this.key, style, this.children);
  }

  setChildren(children) {
    return new Block(this.schema, this.key, this.style, children);
  }

  regenerateKey() {
    return this.setKey(createKey());
  }

  clearStyle() {
    return this.setStyle(Style.create());
  }

  createPosition(offset, inclusive = false) {
    return Position.create(this.children, offset, inclusive);
  }

  format(attributes) {
    return this.setStyle(
      this.style.format(attributes, type => this.schema.isBlockMark(type))
    );
  }

  formatAt(offset, length, attributes) {
    const node = this;

    if (offset + length === node.length) {
      return node
        .format(attributes)
        .formatAt(offset, length - EOL.length, attributes);
    }

    const fragment = [];

    const startPos = node.createPosition(offset);

    if (!startPos.node) {
      return node;
    }

    const endPos = node.createPosition(offset + length, true);

    if (!endPos.node) {
      return node;
    }

    if (startPos.index === endPos.index) {
      if (startPos.offset === 0) {
        if (endPos.offset < startPos.node.length) {
          fragment.push(
            startPos.node.slice(0, endPos.offset).format(attributes),
            startPos.node.slice(endPos.offset)
          );
        } else {
          fragment.push(startPos.node.format(attributes));
        }
      } else {
        if (endPos.offset < startPos.node.length) {
          fragment.push(
            startPos.node.slice(0, startPos.offset),
            startPos.node
              .slice(startPos.offset, endPos.offset)
              .format(attributes),
            startPos.node.slice(endPos.offset)
          );
        } else {
          fragment.push(
            startPos.node.slice(0, startPos.offset),
            startPos.node.slice(startPos.offset).format(attributes)
          );
        }
      }
    } else {
      if (startPos.offset === 0) {
        fragment.push(startPos.node.format(attributes));
      } else if (startPos.offset < startPos.node.length) {
        fragment.push(
          startPos.node.slice(0, startPos.offset),
          startPos.node.slice(startPos.offset).format(attributes)
        );
      } else {
        fragment.push(startPos.node);
      }

      node.children.slice(startPos.index + 1, endPos.index).forEach(child => {
        fragment.push(child.format(attributes));
      });

      if (endPos.offset === 0) {
        fragment.push(endPos.node);
      } else if (endPos.offset < endPos.node.length) {
        fragment.push(
          endPos.node.slice(0, endPos.offset).format(attributes),
          endPos.node.slice(endPos.offset)
        );
      } else {
        fragment.push(endPos.node.format(attributes));
      }
    }

    const children = node.children
      .slice(0, startPos.index)
      .concat(fragment)
      .concat(node.children.slice(endPos.index + 1));

    return node.setChildren(children);
  }

  insertAt(offset, value, attributes) {
    const node = this;

    let newChild;

    if (typeof value === "string") {
      newChild = Text.create({
        schema: node.schema,
        value
      });
    } else {
      if (node.schema.isInlineEmbed(Embed.type(value))) {
        newChild = Embed.create({
          schema: node.schema,
          value
        });
      }
    }

    if (!newChild) {
      return node;
    }

    newChild = newChild.format(attributes);

    const fragment = [];

    const pos = node.createPosition(offset);

    if (pos.node && pos.offset > 0) {
      if (pos.offset === pos.node.length) {
        fragment.push(pos.node);
      } else {
        fragment.push(pos.node.slice(0, pos.offset));
      }
    }

    fragment.push(newChild);

    if (pos.node && pos.offset < pos.node.length) {
      if (pos.offset === 0) {
        fragment.push(pos.node);
      } else {
        fragment.push(pos.node.slice(pos.offset));
      }
    }

    const children = node.children
      .slice(0, pos.index)
      .concat(fragment)
      .concat(node.children.slice(pos.index + 1));

    return node.setChildren(children);
  }

  deleteAt(offset, length) {
    const node = this;

    const fragment = [];

    const startPos = node.createPosition(offset);

    if (!startPos.node) {
      return node;
    }

    const endPos = node.createPosition(offset + length, true);

    if (!endPos.node) {
      return node;
    }

    if (startPos.offset > 0) {
      fragment.push(startPos.node.slice(0, startPos.offset));
    }

    if (endPos.offset < endPos.node.length) {
      fragment.push(endPos.node.slice(endPos.offset, Infinity));
    }

    const children = node.children
      .slice(0, startPos.index)
      .concat(fragment)
      .concat(node.children.slice(endPos.index + 1));

    return node.setChildren(children);
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
