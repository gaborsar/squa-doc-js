export default class AtomicIterator {
    constructor(node) {
        this.node = node;
        this.offset = 0;
    }

    isDone() {
        return this.node.length <= this.offset;
    }

    next() {
        if (this.isDone()) {
            return null;
        }

        const { node } = this;
        this.offset = node.length;

        return node;
    }
}
