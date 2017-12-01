import Pool from "./Pool";
import Mark from "./Mark";

const pool = new Pool();

export default class Style {
  static create(props = {}) {
    return pool.recycle(new Style(props));
  }

  constructor(props = {}) {
    const { marks = [] } = props;
    this.marks = marks;
  }

  toObject() {
    const attributes = {};

    this.marks.forEach(mark => {
      attributes[mark.type] = mark.value;
    });

    return attributes;
  }

  equals(other) {
    if (this.marks.length !== other.marks.length) {
      return false;
    }

    for (let i = 0, l = this.marks.length; i < l; i++) {
      if (this.marks[i] !== other.marks[i]) {
        return false;
      }
    }

    return true;
  }

  update(attributes, predicate) {
    let marks = this.marks;

    for (const [type, value] of Object.entries(attributes)) {
      if (predicate(type)) {
        marks = marks.filter(mark => mark.type !== type);

        if (value !== null) {
          marks = marks.concat(Mark.create({ type, value }));
        }
      }
    }

    marks.sort(Mark.compare);

    return Style.create({ marks });
  }

  hasMark(type) {
    return this.marks.some(mark => mark.type === type);
  }

  getMark(type) {
    const mark = this.marks.find(mark => mark.type === type);

    if (mark) {
      return mark.value;
    }
  }
}
