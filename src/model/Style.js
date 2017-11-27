import Mark from "./Mark";

const pool = [];

function recycle(style) {
  for (const pooled of pool) {
    if (pooled.equals(style)) {
      return pooled;
    }
  }
  pool.push(style);
  return style;
}

export default class Style {
  static create(props = {}) {
    const { marks = [] } = props;
    return recycle(new Style(marks));
  }

  constructor(marks) {
    this.marks = marks;
  }

  toJSON() {
    return {
      marks: this.marks.map(mark => mark.toJSON())
    };
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
    return mark ? mark.value : null;
  }
}
