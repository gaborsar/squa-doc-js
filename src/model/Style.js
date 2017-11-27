"use strict";

import Mark from "./Mark";

const styles = [];

export default class Style {
  static create(props = {}) {
    const { marks = [] } = props;

    const style = new Style(marks);

    for (let i = 0; i < styles.length; i++) {
      const pooledStyle = styles[i];

      if (pooledStyle.equals(style)) {
        return pooledStyle;
      }
    }

    styles.push(style);

    return style;
  }

  constructor(marks) {
    this.marks = marks;
  }

  toJSON() {
    return {
      marks: this.marks.map(mark => mark.toJSON())
    };
  }

  format(attributes, predicate) {
    let marks = this.marks;

    const types = Object.keys(attributes).filter(predicate);

    types.forEach(type => {
      marks = marks.filter(mark => mark.type !== type);

      const value = attributes[type];

      if (value !== null) {
        marks = marks.concat(Mark.create({ type, value }));
      }
    });

    marks.sort(Mark.compare);

    return Style.create({ marks });
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
}
