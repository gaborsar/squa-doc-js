import NodeType from "./NodeType";
import LeafIterator from "./LeafIterator";

export default class TableEnd {
    get type() {
        return NodeType.TableEnd;
    }

    get length() {
        return 1;
    }

    iterator() {
        return new LeafIterator(this);
    }
}
