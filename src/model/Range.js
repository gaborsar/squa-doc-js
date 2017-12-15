export default class Range {
  constructor(elements) {
    this.elements = elements;
  }

  map(callback) {
    return this.elements.map(callback);
  }

  reduce(callback, value) {
    return this.elements.reduce(callback, value);
  }

  filter(predicate) {
    return this.elements.filter(predicate);
  }

  forEach(callback) {
    return this.elements.forEach(callback);
  }
}
