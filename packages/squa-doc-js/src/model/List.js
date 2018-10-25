export default class List {
    constructor(items = []) {
        this.items = items;
    }

    getLength() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    clear() {
        return new List();
    }

    push(item) {
        return new List(this.items.concat(item));
    }

    head() {
        return this.items[0];
    }

    tail() {
        return new List(this.items.slice(1));
    }

    last() {
        return this.items[this.items.length - 1];
    }

    init() {
        return new List(this.items.slice(0, -1));
    }

    map(fn) {
        return this.items.map(fn);
    }

    reduce(fn, initialValue) {
        return this.items.reduce(fn, initialValue);
    }

    forEach(fn) {
        this.items.forEach(fn);
    }
}
