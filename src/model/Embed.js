"use strict";

import Schema from "./Schema";
import Style from "./Style";
import Node from "./Node";
import LeafMixin from "./mixins/Leaf";
import FormatMixin from "./mixins/Format";
import createKey from "./utils/createKey";

export default class Embed extends FormatMixin(LeafMixin(Node)) {
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
    super(schema, key);
    this.style = style;
    this.value = value;
  }

  merge(props) {
    return Embed.create(
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

  get type() {
    return Embed.type(this.value);
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
      value: this.value
    };
  }

  format(attributes) {
    const style = this.style.update(attributes, type =>
      this.schema.isEmbedMark(this.type, type)
    );
    return this.setStyle(style);
  }

  formatAt(offset, length, attributes) {
    if (offset === 0 && length === 1) {
      return this.format(attributes);
    }
    return this;
  }
}
