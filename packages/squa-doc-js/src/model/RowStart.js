import NodeType from "./NodeType";
import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import LeafIterator from "./LeafIterator";
import applyMixins from "./applyMixins";

export default class RowStart {
    constructor(schema, key, style) {
        this.schema = schema;
        this.key = key;
        this.style = style;
    }

    get type() {
        return NodeType.RowStart;
    }

    get length() {
        return 1;
    }

    merge(props) {
        return this.schema.createRowStart({ ...this, ...props });
    }

    iterator() {
        return new LeafIterator(this);
    }

    isValidMark(name) {
        return this.schema.isRowMark(name);
    }
}

applyMixins(RowStart, NodeMixin, FormatMixin);
