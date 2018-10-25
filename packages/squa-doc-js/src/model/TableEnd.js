import NodeType from "./NodeType";
import AtomicIterator from "./AtomicIterator";

export default class TableEnd {
    get type() {
        return NodeType.TableEnd;
    }

    get length() {
        return 1;
    }

    iterator() {
        return new AtomicIterator(this);
    }
}
