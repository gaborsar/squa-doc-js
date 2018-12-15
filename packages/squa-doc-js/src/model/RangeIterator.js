import RangeItem from "./RangeItem";

export default class RangeIterator {
    constructor(nodes) {
        this.nodes = nodes;
        this.index = 0;
        this.offset = 0;
    }

    isDone() {
        return this.nodes.length <= this.index;
    }

    next(length) {
        if (this.isDone()) {
            return null;
        }

        const node = this.nodes[this.index];

        const adjustedLength = Math.min(length, node.length - this.offset);
        const nextOffset = this.offset + adjustedLength;

        const item = new RangeItem(
            node,
            this.index,
            this.offset,
            adjustedLength
        );

        if (nextOffset < node.length) {
            this.offset = nextOffset;
        } else {
            this.index++;
            this.offset = 0;
        }

        return item;
    }
}
