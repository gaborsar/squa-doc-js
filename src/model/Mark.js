"use strict";

const pool = [];

function recycle(mark) {
  for (const pooled of pool) {
    if (pooled.equals(mark)) {
      return pooled;
    }
  }
  pool.push(mark);
  return mark;
}

export default class Mark {
  static create(props = {}) {
    const { type = "", value = true } = props;
    return recycle(new Mark(type, value));
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
