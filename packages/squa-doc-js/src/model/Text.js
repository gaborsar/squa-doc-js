import Delta from "quill-delta";
import NodeType from "./NodeType";
import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import LeafMixin from "./LeafMixin";
import TextIterator from "./TextIterator";

class Text {
    constructor(schema, key, style, value) {
        this.schema = schema;
        this.key = key;
        this.style = style;
        this.value = value;
    }

    get type() {
        return NodeType.Text;
    }

    get length() {
        return this.value.length;
    }

    get text() {
        return this.value;
    }

    get delta() {
        return new Delta().insert(this.value, this.getAttributes());
    }

    getType() {
        return this.type;
    }

    getLength() {
        return this.length;
    }

    getText() {
        return this.text;
    }

    getDelta() {
        return this.delta;
    }

    merge(props) {
        return this.schema.createText({ ...this, ...props });
    }

    iterator() {
        return new TextIterator(this);
    }

    isValidMark(name) {
        return this.schema.isTextMark(name);
    }

    slice(start, end) {
        return this.regenerateKey().setValue(this.value.slice(start, end));
    }

    concat(other) {
        return other.setValue(this.value + other.value);
    }
}

Object.assign(Text.prototype, NodeMixin, FormatMixin, LeafMixin);

export default Text;
