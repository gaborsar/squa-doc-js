import Delta from "quill-delta";
import NodeType from "./NodeType";
import FormatMixin from "./FormatMixin";
import EmbedMixin from "./EmbedMixin";
import NodeMixin from "./NodeMixin";
import LeafIterator from "./LeafIterator";

class BlockEmbed {
    constructor(schema, key, style, name, value) {
        this.schema = schema;
        this.key = key;
        this.style = style;
        this.name = name;
        this.value = value;
    }

    get type() {
        return NodeType.BlockEmbed;
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
        return this.schema.createBlockEmbed({ ...this, ...props });
    }

    iterator() {
        return new LeafIterator(this);
    }

    isValidMark(name) {
        return (
            this.schema.isBlockMark(name) ||
            this.schema.isBlockEmbedMark(this.name, name)
        );
    }
}

export default FormatMixin(EmbedMixin(NodeMixin(BlockEmbed)));
