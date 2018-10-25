import NodeType from "./NodeType";
import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import AtomicIterator from "./AtomicIterator";

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
        return new AtomicIterator(this);
    }

    isValidMark(name) {
        return this.schema.isCellMark(name);
    }
}

Object.assign(CellStart.prototype, NodeMixin, FormatMixin);

export default CellStart;
