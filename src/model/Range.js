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

  forEach(callback) {
    this.elements.forEach(callback);
    return this;
  }
}
