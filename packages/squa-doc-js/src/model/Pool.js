export default class Pool {
    constructor(items = []) {
        this.items = items;
    }

    recycle(item, equals) {
        for (let i = 0, l = this.items.length; i < l; i++) {
            const pooledItem = this.items[i];
            if (equals(pooledItem, item)) {
                return pooledItem;
            }
        }
        this.items.push(item);
        return item;
    }
}
