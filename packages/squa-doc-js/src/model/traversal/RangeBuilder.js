import List from "../List";

export default class RangeBuilder {
  constructor() {
    this.items = [];
  }

  pushRangeItem(item) {
    this.items.push(item);
    return this;
  }

  pushRange(range) {
    this.items = this.items.concat(range.items);
    return this;
  }

  build() {
    return new List(this.items);
  }
}
