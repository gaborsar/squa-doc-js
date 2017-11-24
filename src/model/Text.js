"use strict";

import Schema from "./Schema";
import Style from "./Style";
import createKey from "./createKey";

/**
 * Represents a text node.
 */
export default class Text {
  /**
   * Returns a new text node based on the given props object.
   *
   * @param {Object} [props]
   * @param {Schema} [props.schema]
   * @param {string} [props.key}
   * @param {Style} [props.style]
   * @param {string} [props.value]
   * @returns {Text}
   */
  static create(props = {}) {
    const {
      schema = new Schema(),
      key = createKey(),
      style = Style.create(),
      value = ""
    } = props;
    return new Text(schema, key, style, value);
  }

  /**
   * Constructor.
   *
   * @param {Schema} schema
   * @param {string} key
   * @param {style} style
   * @param {value} value
   */
  constructor(schema, key, style, value) {
    /** @type {Schema} */
    this.schema = schema;

    /** @type {Style} */
    this.style = style;

    /** @type {string} */
    this.key = key;

    /** @type {string} */
    this.value = value;
  }

  /**
   * Returns the length of the node.
   *
   * @returns {number}
   */
  get length() {
    return this.value.length;
  }

  /**
   * Returns the text content of the node.
   *
   * @returns {string}
   */
  get text() {
    return this.value;
  }

  /**
   * Returns the JSON representation of the node.
   *
   * @returns {Object}
   */
  toJSON() {
    return {
      style: this.style.toJSON(),
      value: this.value
    };
  }

  /**
   * Sets the key of the node.
   *
   * @param {string} key
   * @returns {Text}
   */
  setKey(key) {
    return new Text(this.schema, key, this.style, this.value);
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
   * Sets the style of the node.
   *
   * @param {Style} style
   * @returns {Text}
   */
  setStyle(style) {
    return new Text(this.schema, this.key, style, this.value);
  }

  /**
   * Sets the value of the node.
   *
   * @param {string} value
   * @returns {Text}
   */
  setValue(value) {
    return new Text(this.schema, this.key, this.style, value);
  }

  /**
   * Formats the node.
   *
   * @param {Object} attributes
   * @returns {Text}
   */
  format(attributes) {
    let node = this;

    const style = node.style.format(attributes, type =>
      node.schema.isInlineMark(type)
    );

    node = node.setStyle(style);

    return node;
  }

  /**
   * Returns a slice of the node.
   *
   * @param {number} startOffset
   * @param {number} endOffset
   * @returns {Text}
   */
  slice(startOffset = 0, endOffset = Infinity) {
    let node = this;

    node = node.regenerateKey();

    node = node.setValue(node.value.slice(startOffset, endOffset));

    return node;
  }

  /**
   * Concatenates the node with the given node.
   *
   * @param {Text} other
   * @returns {Text}
   */
  concat(other) {
    return other.setValue(this.value + other.value);
  }
}
