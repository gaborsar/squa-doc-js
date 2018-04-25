import Delta from "quill-delta";
import NodeMixin from "./mixins/Node";
import FormatMixin from "./mixins/Format";
import EmbedMixin from "./mixins/Embed";
import AtomicIterator from "./iterators/AtomicIterator";
import Style from "./Style";
import { createKey } from "./Keys";

class InlineEmbed {
  constructor({
    schema,
    key = createKey(),
    style = Style.create(),
    name,
    value
  }) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.name = name;
    this.value = value;
  }

  // Getters

  getNodeType() {
    return "inline-embed";
  }

  getLength() {
    return 1;
  }

  getText() {
    return "*";
  }

  getDelta() {
    const { name, value } = this;
    return new Delta().insert({ [name]: value }, this.getAttributes());
  }

  // Node mixin methods

  merge(props) {
    return new InlineEmbed({ ...this, ...props });
  }

  // Editable mixin methods (required by Document and Block)

  iterator() {
    return new AtomicIterator(this);
  }

  // Format mixin methods

  isValidMark(name) {
    const { schema } = this;
    return schema.isTextMark(name) || schema.isInlineEmbedMark(this.name, name);
  }
}

Object.assign(InlineEmbed.prototype, NodeMixin, FormatMixin, EmbedMixin);

export default InlineEmbed;
