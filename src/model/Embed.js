"use strict";

import Schema from "./Schema";
import Style from "./Style";
import createKey from "./createKey";

export default class Embed {
  static create(props = {}) {
    const {
      schema = new Schema(),
      key = createKey(),
      style = Style.create(),
      value = {}
    } = props;
    return new Embed(schema, key, style, value);
  }

  static type(value) {
    return Object.keys(value)[0];
  }

  constructor(schema, key, style, value) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.value = value;
  }

  get length() {
    return 1;
  }

  get text() {
    return "*";
  }

  get type() {
    return Embed.type(this.value);
  }

  toJSON() {
    return {
      style: this.style.toJSON(),
      value: this.value
    };
  }

  setKey(key) {
    return new Embed(this.schema, key, this.style, this.value);
  }

  setStyle(style) {
    return new Embed(this.schema, this.key, style, this.value);
  }

  setValue(value) {
    return new Embed(this.schema, this.key, this.style, value);
  }

  regenerateKey() {
    return this.setKey(createKey());
  }

  format(attributes) {
    return this.setStyle(
      this.style.format(attributes, type =>
        this.schema.isEmbedMark(this.type, type)
      )
    );
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
