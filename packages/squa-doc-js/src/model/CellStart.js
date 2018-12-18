import NodeType from "./NodeType";
import NodeMixin from "./NodeMixin";
import FormatMixin from "./FormatMixin";
import LeafIterator from "./LeafIterator";
import applyMixins from "./applyMixins";

export default class CellStart {
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

applyMixins(CellStart, NodeMixin, FormatMixin);
