import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import NodeType from "./NodeType";
import LeafIterator from "./LeafIterator";

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
        return new LeafIterator(this);
    }

    isValidMark(name) {
        return this.schema.isTableMark(name);
    }
}

export default FormatMixin(NodeMixin(TableStart));
