"use strict";

import Schema from "./Schema";
import Embed from "./Embed";
import Block, { EOL } from "./Block";
import createKey from "./createKey";
import findNodePosition from "./findNodePosition";

/**
 * Represents a document node.
 */
export default class Document {
  /**
   * Returns a new node based on the given props object.
   *
   * @param {Object} [props]
   * @param {Schema} [props.schema]
   * @param {(Block|Embed)[]} [props.children]
   * @returns {Document}
   */
  static create(props = {}) {
    const { schema = new Schema(), key = createKey(), children = [] } = props;
    return new Document(schema, key, children);
  }

  /**
   * Constructor.
   *
   * @param {Schema} schema
   * @param {string} key
   * @param {(Block|Embed)[]} children
   */
  constructor(schema, key, children) {
    /** @type {Schema} */
    this.schema = schema;

    /** @type {string} */
    this.key = key;

    /** @type {(Block|Embed)[]} */
    this.children = children;
  }

  /**
   * Returns the length of the node.
   *
   * @returns {number}
   */
  get length() {
    return this.children.reduce((length, child) => length + child.length, 0);
  }

  /**
   * Returns the text of the node.
   *
   * @returns {string}
   */
  get text() {
    return this.children.reduce((text, child) => text + child.text, "");
  }

  /**
   * Returns the JSON representation of the node.
   *
   * @returns {Object}
   */
  toJSON() {
    return {
      children: this.children.map(child => child.toJSON())
    };
  }

  /**
   * Sets the key of the node.
   *
   * @param {string} key
   * @returns {Document}
   */
  setKey(key) {
    return new Document(this.schema, key, this.children);
  }

  /**
   * Regenerates the key of the node.
   *
   * @return {Block}
   */
  regenerateKey() {
    return this.setKey(createKey());
  }

  /**
   * Sets the children of the node.
   *
   * @param {(Block|Embed)[]} children
   * @returns {Document}
   */
  setChildren(children) {
    return new Document(this.schema, this.key, children);
  }

  /**
   * Formats a range in the node.
   *
   * @param {number} offset
   * @param {number} length
   * @param {Object} attributes
   * @returns {Document}
   */
  formatAt(offset, length, attributes) {
    const node = this;

    const startPos = findNodePosition(node.children, offset, true);

    if (!startPos) {
      return node;
    }

    const endPos = findNodePosition(node.children, offset + length, true);

    if (!endPos) {
      return node;
    }

    const startChild = node.children[startPos.index];
    const endChild = node.children[endPos.index];

    let fragment = [];

    if (startPos.index === endPos.index) {
      // format a range in the child
      fragment.push(
        startChild.formatAt(
          startPos.offset,
          endPos.offset - startPos.offset,
          attributes
        )
      );
    } else {
      if (startPos.offset < startChild.length) {
        // format a range in the start child
        fragment.push(
          startChild.formatAt(
            startPos.offset,
            startChild.length - startPos.offset,
            attributes
          )
        );
      } else {
        // keep the start child without formatting
        fragment.push(startChild);
      }

      // format every children between the start child and the end child
      node.children.slice(startPos.index + 1, endPos.index).forEach(child => {
        fragment.push(child.formatAt(0, child.length, attributes));
      });

      // format a range in the end child
      fragment.push(endChild.formatAt(0, endPos.offset, attributes));
    }

    fragment = fragment.map(child => child.normalize());

    const children = node.children
      .slice(0, startPos.index)
      .concat(fragment)
      .concat(node.children.slice(endPos.index + 1));

    return node.setChildren(children);
  }

  /**
   * Inserts a value into the node.
   *
   * @param {number} offset
   * @param {string|Object} value
   * @param {Object} attributes
   * @returns {Document}
   */
  insertAt(offset, value, attributes) {
    let node = this;

    const pos = findNodePosition(node.children, offset, false);

    if (!pos) {
      return node;
    }

    if (typeof value === "string") {
      let fragment = [];

      let { offset } = pos;
      let child = node.children[pos.index];

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
      const embedType = Object.keys(value)[0];

      if (node.schema.isBlockEmbed(embedType)) {
        if (pos.offset === 0) {
          let newChild = Embed.create({
            schema: node.schema,
            type: embedType,
            value: value[embedType]
          });

          newChild = newChild.format(attributes);

          const children = node.children
            .slice(0, pos.index)
            .concat(newChild)
            .concat(node.children.slice(pos.index));

          node = node.setChildren(children);
        }
      } else if (node.schema.isInlineEmbed(embedType)) {
        let child = node.children[pos.index];

        child = child.insertAt(pos.offset, value, attributes).normalize();

        const children = node.children
          .slice(0, pos.index)
          .concat(child)
          .concat(node.children.slice(pos.index + 1));

        node = node.setChildren(children);
      }
    }

    return node;
  }

  /**
   * Deletes a range from the node.
   *
   * @param {number} offset
   * @param {number} length
   * @returns {Document}
   */
  deleteAt(offset, length) {
    const node = this;

    const startPos = findNodePosition(node.children, offset, false);

    if (!startPos) {
      return node;
    }

    const endPos = findNodePosition(node.children, offset + length, false);

    if (!endPos) {
      return node;
    }

    let fragment = [];

    if (startPos.index === endPos.index) {
      const child = node.children[startPos.index];

      // delete a range from the child
      fragment.push(
        child.deleteAt(startPos.offset, endPos.offset - startPos.offset)
      );
    } else {
      const startChild = node.children[startPos.index];
      const endChild = node.children[endPos.index];

      if (startPos.offset > 0) {
        if (endChild instanceof Block) {
          // delete a range from the start child,
          // delete a range from the end child,
          // merge the start child and the end child
          fragment.push(
            startChild
              .deleteAt(
                startPos.offset,
                startChild.length - startPos.offset - 1
              )
              .concat(endChild.deleteAt(0, endPos.offset))
          );
        } else {
          // delete range from the start child,
          // delete the end child to compensate for the length of the
          // start child
          fragment.push(
            startChild.deleteAt(
              startPos.offset,
              startChild.length - startPos.offset - 1
            )
          );
        }
      } else {
        if (endPos.offset === 0) {
          // keep the end child
          fragment.push(endChild);
        } else if (endPos.offset < endChild.length) {
          // delete a range from the end child
          fragment.push(endChild.deleteAt(0, endPos.offset));
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
