"use strict";

import Schema from "./Schema";
import Style from "./Style";
import createKey from "./utils/createKey";
import nodeMixin from "./mixins/node";
import leafMixin from "./mixins/leaf";
import formatMixin from "./mixins/format";

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

  merge(props) {
    return Text.create(
      Object.assign(
        {
          schema: this.schema,
          key: this.key,
          style: this.style,
          value: this.value
        },
        props
      )
    );
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

  format(attributes) {
    return this.setStyle(
      this.style.update(attributes, type => this.schema.isInlineMark(type))
    );
  }

  slice(startOffset, endOffset) {
    return this.regenerateKey().setValue(
      this.value.slice(startOffset, endOffset)
    );
  }

  concat(other) {
    return other.setValue(this.value + other.value);
  }
}

nodeMixin(Text);
leafMixin(Text);
formatMixin(Text);
