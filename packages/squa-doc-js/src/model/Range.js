export default class Range {
  constructor(elements) {
    this.elements = elements;
  }

  forEach(callback) {
    return this.elements.forEach(callback);
  }

  map(callback) {
    return this.elements.map(callback);
  }
}
