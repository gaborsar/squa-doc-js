export default class Snapshot {
  static create(props) {
    return new Snapshot(props);
  }

  constructor(props) {
    const {
      type = "",
      undoDelta,
      redoDelta,
      selection,
      timestamp = Date.now()
    } = props;

    this.type = type;
    this.undoDelta = undoDelta;
    this.redoDelta = redoDelta;
    this.selection = selection;
    this.timestamp = timestamp;
  }

  merge(props) {
    return Snapshot.create({
      ...this,
      ...props
    });
  }

  setType(type) {
    return this.merge({ type });
  }

  setUndoDelta(undoDelta) {
    return this.merge({ undoDelta });
  }

  setRedoDelta(redoDelta) {
    return this.merge({ redoDelta });
  }

  setSelection(selection) {
    return this.merge({ selection });
  }

  setTimestamp(timestamp) {
    return this.merge({ timestamp });
  }

  concat(other) {
    const undoDelta = other.undoDelta.compose(this.undoDelta);
    const redoDelta = this.redoDelta.compose(other.redoDelta);

    return this.setUndoDelta(undoDelta)
      .setRedoDelta(redoDelta)
      .setTimestamp(other.timestamp);
  }
}
