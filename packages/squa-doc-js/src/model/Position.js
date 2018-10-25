export default class Position {
    constructor(node, index, offset) {
        this.node = node;
        this.index = index;
        this.offset = offset;
    }

    getNode() {
        return this.node;
    }

    getIndex() {
        return this.index;
    }

    getOffset() {
        return this.offset;
    }
}
