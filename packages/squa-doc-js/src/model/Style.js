import Mark, { compareMarks } from "./Mark";
import Pool from "./Pool";

const pool = new Pool();

export default class Style {
  static create(props = {}) {
    return pool.recycle(new Style(props));
  }

  constructor({ marks = [] } = {}) {
    this.marks = marks.sort(compareMarks);
  }

  merge(props) {
    return Style.create({ ...this, ...props });
  }

  getMarks() {
    return this.marks;
  }

  setMarks(marks) {
    return this.merge({ marks });
  }

  isEmpty() {
    return this.marks.length === 0;
  }

  hasAttribute(name) {
    return this.marks.some(mark => mark.getName() === name);
  }

  getAttribute(name) {
    const mark = this.marks.find(currentMark => currentMark.getName() === name);

    if (mark === undefined) {
      return null;
    }

    return mark.getValue();
  }

  setAttribute(name, value) {
    let marks = this.marks.filter(mark => mark.getName() !== name);

    if (value !== null) {
      marks = marks.concat(Mark.create({ name, value }));
    }

    return this.setMarks(marks);
  }

  getAttributes() {
    const attributes = {};

    this.marks.forEach(mark => {
      attributes[mark.getName()] = mark.getValue();
    });

    return attributes;
  }

  setAttributes(attributes, isValidMark) {
    return Object.keys(attributes)
      .filter(isValidMark)
      .reduce(
        (style, name) => style.setAttribute(name, attributes[name]),
        this
      );
  }

  intersect(other) {
    return this.setMarks(
      this.marks.filter(mark => other.marks.indexOf(mark) !== -1)
    );
  }
}
