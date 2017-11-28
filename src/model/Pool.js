export default class Pool {
  constructor() {
    this._values = [];
  }

  recycle(value) {
    for (const pooled of this._values) {
      if (pooled.equals(value)) {
        return pooled;
      }
    }
    this._values.push(value);
    return value;
  }
}
