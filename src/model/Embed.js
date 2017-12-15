import Delta from "quill-delta";
import Schema from "./Schema";
import Style from "./Style";
import Node from "./Node";
import LeafMixin from "./mixins/Leaf";
import FormatMixin from "./mixins/Format";
import createKey from "./utils/createKey";

export default class Embed extends FormatMixin(LeafMixin(Node)) {
  static create(props = {}) {
    return new Embed(props);
  }

  static type(value) {
    return Object.keys(value)[0];
  }

  constructor(props = {}) {
    const {
      schema = new Schema(),
      key = createKey(),
      style = Style.create(),
      value = {}
    } = props;

    super(schema, key);

    this.style = style;
    this.value = value;
  }

  merge(props) {
    return Embed.create({ ...this, ...props });
  }

  get kind() {
    return "embed";
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

  get delta() {
    return new Delta().insert(this.value, this.style.toObject());
  }

  get isBlockEmbed() {
    return this.schema.isBlockEmbed(this.type);
  }

  get isInlineEmbed() {
    return this.schema.isInlineEmbed(this.type);
  }

  format(attributes) {
    const style = this.style.update(attributes, type =>
      this.schema.isEmbedMark(this.type, type)
    );
    return this.setStyle(style);
  }

  formatAt(offset, length, attributes) {
    return offset === 0 && length === 1 ? this.format(attributes) : this;
  }
}
