import Delta from "quill-delta";
import NodeMixin from "./mixins/Node";
import FormatMixin from "./mixins/Format";
import LeafMixin from "./mixins/Leaf";
import TextIterator from "./iterators/TextIterator";
import Style from "./Style";
import { createKey } from "./Keys";

class Text {
  constructor({ schema, key = createKey(), style = Style.create(), value }) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.value = value;
  }

  // Getters

  getNodeType() {
    return "text";
  }

  getLength() {
    return this.value.length;
  }

  getText() {
    return this.value;
  }

  getDelta() {
    return new Delta().insert(this.value, this.getAttributes());
  }

  // Node mixin methods

  merge(props) {
    return new Text({ ...this, ...props });
  }

  // Editable mixin methods (required by Document and Block)

  iterator() {
    return new TextIterator(this);
  }

  // Format mixin methods

  isValidMark(name) {
    return this.schema.isTextMark(name);
  }

  // Own methods

  slice(start, end) {
    return this.regenerateKey().setValue(this.value.slice(start, end));
  }
}

Object.assign(Text.prototype, NodeMixin, FormatMixin, LeafMixin);

export default Text;
