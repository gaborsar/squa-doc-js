import NodeType from "./NodeType";
import FormatMixin from "./FormatMixin";
import NodeMixin from "./NodeMixin";
import LeafIterator from "./LeafIterator";

class RowStart {
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

export default FormatMixin(NodeMixin(RowStart));
