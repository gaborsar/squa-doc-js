import NodeType from "./NodeType";
import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import LeafIterator from "./LeafIterator";
import applyMixins from "./applyMixins";

export default class BlockEnd {
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

applyMixins(BlockEnd, NodeMixin, FormatMixin);
