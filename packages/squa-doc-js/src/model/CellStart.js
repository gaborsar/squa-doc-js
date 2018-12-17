import NodeType from "./NodeType";
import FormatMixin from "./FormatMixin";
import NodeMixin from "./NodeMixin";
import LeafIterator from "./LeafIterator";

class CellStart {
    constructor(schema, key, style) {
        this.schema = schema;
        this.key = key;
        this.style = style;
    }

    get type() {
        return NodeType.CellStart;
    }

    get length() {
        return 1;
    }

    merge(props) {
        return this.schema.createCellStart({ ...this, ...props });
    }

    iterator() {
        return new LeafIterator(this);
    }

    isValidMark(name) {
        return this.schema.isCellMark(name);
    }
}

export default FormatMixin(NodeMixin(CellStart));
