import NodeMixin from "./NodeMixin";
import NodeType from "./NodeType";
import FormatMixin from "./FormatMixin";
import AtomicIterator from "./AtomicIterator";

class TableStart {
    constructor(schema, key, style) {
        this.schema = schema;
        this.key = key;
        this.style = style;
    }

    get type() {
        return NodeType.TableStart;
    }

    get length() {
        return 1;
    }

    merge(props) {
        return this.schema.createTableStart({ ...this, ...props });
    }

    iterator() {
        return new AtomicIterator(this);
    }

    isValidMark(name) {
        return this.schema.isTableMark(name);
    }
}

Object.assign(TableStart.prototype, NodeMixin, FormatMixin);

export default TableStart;
