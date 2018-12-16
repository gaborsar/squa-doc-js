export default class Pool {
    constructor(items = []) {
        this.items = items;
    }

    recycle(item, equals) {
        for (const pooledItem of this.items) {
            if (equals(pooledItem, item)) {
                return pooledItem;
            }
        }
        this.items.push(item);
        return item;
    }
}
