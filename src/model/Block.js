"use strict";

import Style from "./Style";
import Text from "./Text";
import Embed from "./Embed";
import findNodeAt from "./findNodeAt";

export const EOL = "\n";

export default class Block {
  static create(props = {}) {
    const { schema, key = "", style = Style.create(), children = [] } = props;
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

  format(attributes) {
    let node = this;

    const style = node.style.format(attributes, type =>
      node.schema.isBlockMark(type)
    );

    node = node.setStyle(style);

    return node;
  }

  formatAt(offset, length, attributes) {
    let node = this;

    if (offset + length === node.length) {
      return node.format(attributes).formatAt(offset, length - 1, attributes);
    }

    const startPos = findNodeAt(node.children, offset, false);

    if (!startPos) {
      return node;
    }

    const endPos = findNodeAt(node.children, offset + length, true);

    if (!endPos) {
      return node;
    }

    const fragment = [];

    if (startPos.index === endPos.index) {
      const child = node.children[startPos.index];

      if (startPos.offset === 0) {
        if (endPos.offset < child.length) {
          // format the left side of the child
          fragment.push(
            child.slice(0, endPos.offset).format(attributes),
            child.slice(endPos.offset)
          );
        } else {
          // format the child
          fragment.push(child.format(attributes));
        }
      } else {
        if (endPos.offset < child.length) {
          // format the middle of the child
          fragment.push(
            child.slice(0, startPos.offset),
            child.slice(startPos.offset, endPos.offset).format(attributes),
            child.slice(endPos.offset)
          );
        } else {
          // format the right side of the child
          fragment.push(
            child.slice(0, startPos.offset),
            child.slice(startPos.offset).format(attributes)
          );
        }
      }
    } else {
      const startChild = node.children[startPos.index];
      const endChild = node.children[endPos.index];

      if (startPos.offset === 0) {
        // format the start child
        fragment.push(startChild.format(attributes));
      } else {
        // format the right side of the start child
        fragment.push(
          startChild.slice(0, startPos.offset),
          startChild.slice(startPos.offset).format(attributes)
        );
      }

      // format every children between the start child and the end child
      node.children.slice(startPos.index + 1, endPos.index).forEach(child => {
        fragment.push(child.format(attributes));
      });

      if (endPos.offset === 0) {
        // keep the end child without formatting
        fragment.push(endChild);
      } else if (endPos.offset < endChild.length) {
        // format the left side of the end child
        fragment.push(
          endChild.slice(0, endPos.offset).format(attributes),
          endChild.slice(endPos.offset)
        );
      } else {
        // format the end child
        fragment.push(endChild.format(attributes));
      }
    }

    const children = node.children
      .slice(0, startPos.index)
      .concat(fragment)
      .concat(node.children.slice(endPos.index + 1));

    node = node.setChildren(children);

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
    } else {
      const embedType = Object.keys(value)[0];

      if (!node.schema.isInlineEmbed(embedType)) {
        return node;
      }

      newChild = Embed.create({
        schema: node.schema,
        type: embedType,
        value: value[embedType]
      });
    }

    newChild = newChild.format(attributes);

    if (node.children.length === 0) {
      node = node.setChildren([newChild]);

      return node;
    }

    const pos = findNodeAt(node.children, offset, true);

    if (!pos) {
      return node;
    }

    const child = node.children[pos.index];

    const fragment = [];

    if (pos.offset > 0) {
      if (pos.offset === child.length) {
        // keep the child before the new child
        fragment.push(child);
      } else {
        // keep the left side of the child before the new child
        fragment.push(child.slice(0, pos.offset));
      }
    }

    fragment.push(newChild);

    if (pos.offset < child.length) {
      if (pos.offset === 0) {
        // keep the child after the new child
        fragment.push(child);
      } else {
        // keep the left side of the child after the new child
        fragment.push(child.slice(pos.offset));
      }
    }

    const children = node.children
      .slice(0, pos.index)
      .concat(fragment)
      .concat(node.children.slice(pos.index + 1));

    node = node.setChildren(children);

    return node;
  }

  deleteAt(offset, length) {
    let node = this;

    const startPos = findNodeAt(node.children, offset, false);

    if (!startPos) {
      return node;
    }

    const endPos = findNodeAt(node.children, offset + length, true);

    if (!endPos) {
      return node;
    }

    const startChild = node.children[startPos.index];
    const endChild = node.children[endPos.index];

    const fragment = [];

    if (startPos.offset > 0) {
      // keep the left side of the start child
      fragment.push(startChild.slice(0, startPos.offset));
    }

    if (endPos.offset < endChild.length) {
      // keep the right side of the end child
      fragment.push(endChild.slice(endPos.offset, Infinity));
    }

    const children = node.children
      .slice(0, startPos.index)
      .concat(fragment)
      .concat(node.children.slice(endPos.index + 1));

    node = node.setChildren(children);

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

  concat(other) {
    return other.setChildren(this.children.concat(other.children));
  }
}
