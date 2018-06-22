import Pool from "./Pool";

const pool = new Pool();

export default class Mark {
  static create(props) {
    return pool.recycle(new Mark(props));
  }

  constructor({ name, value }) {
    this.name = name;
    this.value = value;
  }

  getName() {
    return this.name;
  }

  getValue() {
    return this.value;
  }
}

export function compareMarks(markA, markB) {
  if (markA.name < markB.name) {
    return -1;
  }
  if (markA.name > markB.name) {
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
