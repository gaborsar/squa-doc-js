const IterationStrategy = require("./IterationStrategy");

export default class ListIterator {
    constructor(nodes) {
        this.nodes = nodes;
        this.index = 0;
        this.iterator = null;
    }

    get isDone() {
        return this.nodes.length <= this.index;
    }

    next(length, strategy = IterationStrategy.Shallow) {
        if (this.isDone) {
            return null;
        }
        if (this.iterator === null) {
            const node = this.nodes[this.index];
            if (
                strategy === IterationStrategy.Shallow &&
                node.length <= length
            ) {
                this.index++;
                return node;
            }
            this.iterator = node.iterator();
        }
        const node = this.iterator.next(length, strategy);
        if (this.iterator.isDone) {
            this.index++;
            this.iterator = null;
        }
        return node;
    }
}
