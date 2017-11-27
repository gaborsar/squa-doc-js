import Schema from "./Schema";
import Style from "./Style";
import Node from "./Node";
import LeafMixin from "./mixins/Leaf";
import FormatMixin from "./mixins/Format";
import createKey from "./utils/createKey";

export default class Text extends FormatMixin(LeafMixin(Node)) {
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
    super(schema, key);
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
    const style = this.style.update(attributes, type =>
      this.schema.isInlineMark(type)
    );
    return this.setStyle(style);
  }

  slice(startOffset, endOffset) {
    const value = this.value.slice(startOffset, endOffset);
    return this.regenerateKey().setValue(value);
  }

  concat(other) {
    return other.setValue(this.value + other.value);
  }
}
