"use strict";

import Schema from "./Schema";
import Style from "./Style";
import createKey from "./createKey";

/**
 * Represents an embed node.
 */
export default class Embed {
  /**
   * Returns a new embed node based on the given props object.
   *
   * @param {Object} [props]
   * @param {Schema} [props.schema]
   * @param {string} [props.key]
   * @param {Style} [props.style]
   * @param {string} [props.type]
   * @param {string} [props.value]
   * @returns {Embed}
   */
  static create(props = {}) {
    const {
      schema = new Schema(),
      key = createKey(),
      style = Style.create(),
      type = "",
      value = ""
    } = props;
    return new Embed(schema, key, style, type, value);
  }

  /**
   * Constructor.
   *
   * @param {Schema} schema
   * @param {string} key
   * @param {Style} style
   * @param {string} type
   * @param {string} value
   */
  constructor(schema, key, style, type, value) {
    /** @type {Schema} */
    this.schema = schema;

    /** @type {string} */
    this.key = key;

    /** @type {Style} */
    this.style = style;

    /** @type {string} */
    this.type = type;

    /** @type {string} */
    this.value = value;
  }

  /**
   * Returns the length of the node.
   *
   * @returns {number}
   */
  get length() {
    return 1;
  }

  /**
   * Returns the text of the node.
   *
   * @returns {string}
   */
  get text() {
    return "*";
  }

  /**
   * Returns the JSON representation of the node.
   *
   * @returns {Object}
   */
  toJSON() {
    return {
      style: this.style.toJSON(),
      type: this.type,
      value: this.value
    };
  }

  /**
   * Sets the key of the node.
   *
   * @param {string} key
   * @returns {Embed}
   */
  setKey(key) {
    return new Embed(this.schema, key, this.style, this.type, this.value);
  }

  /**
   * Sets the style of the node.
   *
   * @param {Style} style
   * @returns {Embed}
   */
  setStyle(style) {
    return new Embed(this.schema, this.key, style, this.type, this.value);
  }

  /**
   * Sets the type of the node.
   *
   * @param {string} type
   * @returns {Embed}
   */
  setType(type) {
    return new Embed(this.schema, this.key, this.style, type, this.value);
  }

  /**
   * Sets the value of the node.
   *
   * @param {string} value
   * @returns {Embed}
   */
  setValue(value) {
    return new Embed(this.schema, this.key, this.style, this.type, value);
  }

  /**
   * Formats the node.
   *
   * @param {Object} attributes
   * @returns {Embed}
   */
  format(attributes) {
    return this.setStyle(
      this.style.format(attributes, type =>
        this.schema.isEmbedMark(this.type, type)
      )
    );
  }

  /**
   * Formats a range in the node.
   *
   * @param {number} offset
   * @param {number} length
   * @param {Object} attributes
   * @returns {Embed}
   */
  formatAt(offset, length, attributes) {
    let node = this;

    if (offset === 0 && length === 1) {
      node = node.format(attributes);
    }

    return node;
  }

  /**
   * Normalizes the node.
   *
   * @returns {Embed}
   */
  normalize() {
    return this;
  }
}
