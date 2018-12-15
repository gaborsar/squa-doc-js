import Delta from "quill-delta";
import NodeType from "./NodeType";
import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import EmbedMixin from "./EmbedMixin";
import AtomicIterator from "./AtomicIterator";

class InlineEmbed {
    constructor(schema, key, style, name, value) {
        this.schema = schema;
        this.key = key;
        this.style = style;
        this.name = name;
        this.value = value;
    }

    get type() {
        return NodeType.InlineEmbed;
    }

    get length() {
        return 1;
    }

    get text() {
        return "*";
    }

    get delta() {
        return new Delta().insert(
            { [this.name]: this.value },
            this.getAttributes()
        );
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
        return this.schema.createInlineEmbed({ ...this, ...props });
    }

    iterator() {
        return new AtomicIterator(this);
    }

    isValidMark(name) {
        return (
            this.schema.isTextMark(name) ||
            this.schema.isInlineEmbedMark(this.name, name)
        );
    }
}

Object.assign(InlineEmbed.prototype, NodeMixin, FormatMixin, EmbedMixin);

export default InlineEmbed;
