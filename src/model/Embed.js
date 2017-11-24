"use strict";

import Style from "./Style";

export default class Embed {
  static create(props = {}) {
    const {
      schema,
      key = "",
      style = Style.create(),
      type = "",
      value = ""
    } = props;
    return new Embed(schema, key, style, type, value);
  }

  constructor(schema, key, style, type, value) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.type = type;
    this.value = value;
  }

  get length() {
    return 1;
  }

  get text() {
    return "*";
  }

  toJSON() {
    return {
      style: this.style.toJSON(),
      type: this.type,
      value: this.value
    };
  }

  setKey(key) {
    return new Embed(this.schema, key, this.style, this.type, this.value);
  }

  setStyle(style) {
    return new Embed(this.schema, this.key, style, this.type, this.value);
  }

  setType(type) {
    return new Embed(this.schema, this.key, this.style, type, this.value);
  }

  setValue(value) {
    return new Embed(this.schema, this.key, this.style, this.type, value);
  }

  format(attributes) {
    let node = this;

    const style = node.style.format(attributes, type =>
      node.schema.isEmbedMark(node.type, type)
    );

    node = node.setStyle(style);

    return node;
  }

  formatAt(offset, length, attributes) {
    let node = this;

    if (offset === 0 && length === 1) {
      node = node.format(attributes);
    }

    return node;
  }

  normalize() {
    return this;
  }
}
