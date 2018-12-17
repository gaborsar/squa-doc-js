const IterationStrategy = require("./IterationStrategy");

export default class Editor {
    constructor(iterator, builder) {
        this.iterator = iterator;
        this.builder = builder;
    }

    call(fn, ...args) {
        fn.call(this, ...args);
    }

    forLength(length, iterationStrategy, fn) {
        let remainingLength = length;
        while (remainingLength !== 0 && !this.iterator.isDone) {
            const node = this.iterator.next(remainingLength, iterationStrategy);
            if (fn !== undefined) {
                fn(node);
            }
            remainingLength -= node.length;
        }
        return this;
    }

    filter(length, predicate) {
        this.forLength(length, IterationStrategy.Shallow, node => {
            if (predicate(node)) {
                this.builder.append(node);
            }
        });
        return this;
    }

    retain(length, attributes = null) {
        if (attributes === null) {
            this.forLength(length, IterationStrategy.Shallow, node => {
                this.builder.append(node);
            });
        } else {
            this.forLength(length, IterationStrategy.Deep, node => {
                this.builder.append(node.setAttributes(attributes));
            });
        }
        return this;
    }

    insert(value, attributes) {
        this.builder.insert(value, attributes);
        return this;
    }

    delete(length) {
        return this.forLength(length, IterationStrategy.Shallow);
    }

    build() {
        this.retain(Infinity);
        return this.builder.build();
    }
}
