import Style from "./Style";
import Node from "./Node";
import LeafMixin from "./mixins/Leaf";
import FormatMixin from "./mixins/Format";

export default class Text extends FormatMixin(LeafMixin(Node)) {
  static create(props = {}) {
    return new Text(props);
  }

  constructor(props = {}) {
    const { schema, key, style = Style.create(), value = "" } = props;
    super(schema, key);
    this.style = style;
    this.value = value;
  }

  merge(props) {
    return Text.create({ ...this, ...props });
  }

  get isEmbed() {
    return false;
  }

  get isBlock() {
    return false;
  }

  get isInline() {
    return true;
  }

  get length() {
    return this.value.length;
  }

  get text() {
    return this.value;
  }

  format(attributes) {
    return this.setStyle(
      this.style.update(attributes, type => this.schema.isInlineMark(type))
    );
  }

  slice(startOffset = 0, endOffset = Infinity) {
    let node = this;

    if (endOffset < node.length) {
      node = node.regenerateKey();
    }

    node = node.setValue(node.value.slice(startOffset, endOffset));

    return node;
  }

  concat(other) {
    return this.setValue(this.value + other.value);
  }
}
