"use strict";

const marks = [];

export default class Mark {
  static create(props = {}) {
    const { type = "", value = true } = props;

    const mark = new Mark(type, value);

    for (let i = 0, l = marks.length; i < l; i++) {
      const pooledMark = marks[i];

      if (pooledMark.equals(mark)) {
        return pooledMark;
      }
    }

    marks.push(mark);

    return mark;
  }

  static compare(markA, markB) {
    if (markA.type < markB.type) {
      return -1;
    }

    if (markB.type > markA.type) {
      return 1;
    }

    if (markA.value < markB.value) {
      return -1;
    }

    if (markA.value > markB.value) {
      return -1;
    }

    return 0;
  }

  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toJSON() {
    return {
      type: this.type,
      value: this.value
    };
  }

  equals(other) {
    return this.type === other.type && this.value === other.value;
  }
}
