import NodeType from "./NodeType";
import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import AtomicIterator from "./AtomicIterator";

class BlockEnd {
    constructor(schema, key, style) {
        this.schema = schema;
        this.key = key;
        this.style = style;
    }

    get type() {
        return NodeType.BlockEnd;
    }

    get length() {
        return 1;
    }

    merge(props) {
        return this.schema.createBlockEnd({ ...this, ...props });
    }

    iterator() {
        return new AtomicIterator(this);
    }

    isValidMark(name) {
        return this.schema.isBlockMark(name);
    }
}

Object.assign(BlockEnd.prototype, NodeMixin, FormatMixin);

export default BlockEnd;
