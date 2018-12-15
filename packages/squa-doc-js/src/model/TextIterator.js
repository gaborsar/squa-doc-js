export default class TextIterator {
    constructor(node) {
        this.node = node;
        this.offset = 0;
    }

    isDone() {
        return this.node.length <= this.offset;
    }

    next(length) {
        if (this.isDone()) {
            return null;
        }

        let { node } = this;
        if (this.offset > 0 || length < node.length) {
            node = node.slice(this.offset, this.offset + length);
        }

        this.offset += node.length;

        return node;
    }
}
