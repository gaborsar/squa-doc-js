import RangeIterator from "./RangeIterator";
import Range from "./Range";

export default class RangeBuilder {
  constructor(nodes) {
    this._iterator = new RangeIterator(nodes);
    this._elements = [];
  }

  skip(length) {
    this._iterator.next(length);
    return this;
  }

  keep(length) {
    this._iterator.next(length, element => {
      this._elements.push(element);
    });
    return this;
  }

  build() {
    return new Range(this._elements);
  }
}
