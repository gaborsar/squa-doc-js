import Delta from "quill-delta";
import NodeMixin from "./mixins/Node";
import FormatMixin from "./mixins/Format";
import EmbedMixin from "./mixins/Embed";
import AtomicIterator from "./iterators/AtomicIterator";
import Style from "./Style";
import { createKey } from "./Keys";

class BlockEmbed {
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
    return "block-embed";
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
    return new BlockEmbed({ ...this, ...props });
  }

  // Editable mixin methods (required by Document)

  iterator() {
    return new AtomicIterator(this);
  }

  // Format mixin methods

  isValidMark(name) {
    const { schema } = this;
    return schema.isBlockMark(name) || schema.isBlockEmbedMark(this.name, name);
  }
}

Object.assign(BlockEmbed.prototype, NodeMixin, FormatMixin, EmbedMixin);

export default BlockEmbed;
