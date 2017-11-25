"use strict";

import Schema from "./Schema";
import Style from "./Style";
import createKey from "./createKey";

export default class Text {
  static create(props = {}) {
    const {
      schema = new Schema(),
      key = createKey(),
      style = Style.create(),
      value = ""
    } = props;
    return new Text(schema, key, style, value);
  }

  constructor(schema, key, style, value) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.value = value;
  }

  get length() {
    return this.value.length;
  }

  get text() {
    return this.value;
  }

  toJSON() {
    return {
      style: this.style.toJSON(),
      value: this.value
    };
  }

  setKey(key) {
    return new Text(this.schema, key, this.style, this.value);
  }

  setStyle(style) {
    return new Text(this.schema, this.key, style, this.value);
  }

  setValue(value) {
    return new Text(this.schema, this.key, this.style, value);
  }

  regenerateKey() {
    return this.setKey(createKey());
  }

  format(attributes) {
    return this.setStyle(
      this.style.format(attributes, type => this.schema.isInlineMark(type))
    );
  }

  slice(startOffset = 0, endOffset = Infinity) {
    return this.regenerateKey().setValue(
      this.value.slice(startOffset, endOffset)
    );
  }

  concat(other) {
    return other.setValue(this.value + other.value);
  }
}
