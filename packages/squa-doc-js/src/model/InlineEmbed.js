import Delta from "quill-delta";
import NodeType from "./NodeType";
import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import LeafIterator from "./LeafIterator";
import applyMixins from "./applyMixins";

export default class InlineEmbed {
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

    merge(props) {
        return this.schema.createInlineEmbed({ ...this, ...props });
    }

    setName(name) {
        return this.merge({ name });
    }

    setValue(value) {
        return this.merge({ value });
    }

    iterator() {
        return new LeafIterator(this);
    }

    isValidMark(name) {
        return (
            this.schema.isTextMark(name) ||
            this.schema.isInlineEmbedMark(this.name, name)
        );
    }
}

applyMixins(InlineEmbed, NodeMixin, FormatMixin);
