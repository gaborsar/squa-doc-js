import Delta from "quill-delta";
import Style from "./Style";
import Node from "./Node";
import LeafMixin from "./mixins/Leaf";
import FormatMixin from "./mixins/Format";

export default class Embed extends FormatMixin(LeafMixin(Node)) {
  static create(props = {}) {
    return new Embed(props);
  }

  static type(value) {
    return Object.keys(value)[0];
  }

  constructor(props = {}) {
    const { schema, key, style = Style.create(), value = {} } = props;
    super(schema, key);
    this.style = style;
    this.value = value;
  }

  merge(props) {
    return Embed.create({
      ...this,
      ...props
    });
  }

  get type() {
    return Embed.type(this.value);
  }

  get isEmbed() {
    return true;
  }

  get isBlock() {
    return this.schema.isBlockEmbed(this.type);
  }

  get isInline() {
    return this.schema.isInlineEmbed(this.type);
  }

  get length() {
    return 1;
  }

  get text() {
    return "*";
  }

  get delta() {
    return new Delta().insert(this.value, this.style.toObject());
  }

  format(attributes) {
    const style = this.style.update(attributes, type =>
      this.schema.isEmbedMark(this.type, type)
    );
    return this.setStyle(style);
  }
}
