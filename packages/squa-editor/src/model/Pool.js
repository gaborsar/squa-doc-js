export default class Pool {
  constructor() {
    this.values = [];
  }

  recycle(value) {
    for (const pooled of this.values) {
      if (pooled.equals(value)) {
        return pooled;
      }
    }
    this.values.push(value);
    return value;
  }
}
