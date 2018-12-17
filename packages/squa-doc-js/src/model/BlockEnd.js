import NodeType from "./NodeType";
import FormatMixin from "./FormatMixin";
import NodeMixin from "./NodeMixin";
import LeafIterator from "./LeafIterator";

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
        return new LeafIterator(this);
    }

    isValidMark(name) {
        return this.schema.isBlockMark(name);
    }
}

export default FormatMixin(NodeMixin(BlockEnd));
