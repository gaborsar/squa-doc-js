"use strict";

import Schema from "./Schema";
import Style from "./Style";
import Text from "./Text";
import Embed from "./Embed";
import findNodeAt from "./findNodeAt";

/**
 * End of line character.
 *
 * @type {string}
 */
export const EOL = "\n";

/**
 * Represents a block node.
 */
export default class Block {
  /**
   * Returns a new block based on the given props object.
   *
   * @param {Object} [props]
   * @param {Schema} [props.schema]
   * @param {string} [props.key]
   * @param {Style} [props.style]
   * @param {(Text|Embed)[]} [props.schema]
   * @returns {Block}
   */
  static create(props = {}) {
    const {
      schema = new Schema(),
      key = "",
      style = Style.create(),
      children = []
    } = props;
    return new Block(schema, key, style, children);
  }

  /**
   * Constructor.
   *
   * @param {Schema} schema
   * @param {string} key
   * @param {Style} style
   * @param {(Text|Embed)[]} children
   */
  constructor(schema, key, style, children) {
    /** @type {Schema} */
    this.schema = schema;

    /** @type {string} */
    this.key = key;

    /** @type {Style} */
    this.style = style;

    /** @type {(Text|Embed)[]} */
    this.children = children;
  }

  /**
   * Returns the length of the node.
   *
   * @returns {number}
   */
  get length() {
    return this.children.reduce(
      (length, child) => length + child.length,
      EOL.length
    );
  }

  /**
   * Returns the text of the node.
   *
   * @returns {string}
   */
  get text() {
    return this.children.reduce((text, child) => text + child.text, "") + EOL;
  }

  /**
   * Returns the JSON representation of the node.
   *
   * @returns {Object}
   */
  toJSON() {
    return {
      style: this.style.toJSON(),
      children: this.children.map(child => child.toJSON())
    };
  }

  /**
   * Sets the key of the node.
   *
   * @param {string} key
   * @returns {Block}
   */
  setKey(key) {
    return new Block(this.schema, key, this.style, this.children);
  }

  /**
   * Sets the style of the node.
   *
   * @param {Style} style
   * @returns {Block}
   */
  setStyle(style) {
    return new Block(this.schema, this.key, style, this.children);
  }

  /**
   * Sets the children of the node.
   *
   * @param {(Text|Embed)[]} children
   * @returns {Block}
   */
  setChildren(children) {
    return new Block(this.schema, this.key, this.style, children);
  }

  /**
   * Formats the node.
   *
   * @param {Object} attributes
   * @returns {Block}
   */
  format(attributes) {
    let node = this;

    const style = node.style.format(attributes, type =>
      node.schema.isBlockMark(type)
    );

    node = node.setStyle(style);

    return node;
  }

  /**
   * Formats a range in the node.
   *
   * @param {number} offset
   * @param {number} length
   * @param {Object} attributes
   * @returns {*}
   */
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

  /**
   * Inserts a value into the node.
   *
   * @param {number} offset
   * @param {string|Object} value
   * @param {Object} attributes
   * @returns {Block}
   */
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

  /**
   * Deletes a range from the node.
   *
   * @param {number} offset
   * @param {number} length
   * @returns {Block}
   */
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

  /**
   * Normalizes the node.
   *
   * @returns {Block}
   */
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

  /**
   * Concatenates the node with the given node.
   *
   * @param {Block} other
   * @returns {Block}
   */
  concat(other) {
    return other.setChildren(this.children.concat(other.children));
  }
}
