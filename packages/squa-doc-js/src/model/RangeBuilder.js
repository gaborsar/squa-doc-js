import RangeIterator from "./RangeIterator";
import Range from "./Range";

export default class RangeBuilder {
  constructor(nodes) {
    this.iterator = new RangeIterator(nodes);
    this.elements = [];
  }

  skip(length) {
    this.iterator.next(length);
    return this;
  }

  keep(length) {
    this.iterator.next(length, el => {
      this.elements.push(el);
    });
    return this;
  }

  build() {
    return new Range(this.elements);
  }
}
