import { isEqual } from "lodash";

export default class Pool {
  constructor(items = []) {
    this.items = items;
  }

  recycle(item) {
    for (const pooledItem of this.items) {
      if (isEqual(pooledItem, item)) {
        return pooledItem;
      }
    }
    this.items.push(item);
    return item;
  }
}
