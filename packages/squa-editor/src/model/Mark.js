import Pool from "./Pool";

const pool = new Pool();

export default class Mark {
  static create(props = {}) {
    return pool.recycle(new Mark(props));
  }

  static compare(markA, markB) {
    if (markA.type < markB.type) {
      return -1;
    }

    if (markA.type > markB.type) {
      return 1;
    }

    if (markA.value < markB.value) {
      return -1;
    }

    if (markA.value > markB.value) {
      return 1;
    }

    return 0;
  }

  constructor(props = {}) {
    const { type = "", value = true } = props;
    this.type = type;
    this.value = value;
  }

  equals(other) {
    return this.type === other.type && this.value === other.value;
  }
}
