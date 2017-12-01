export default class Selection {
  static create(props = {}) {
    return new Selection(props);
  }

  constructor(props = {}) {
    const { anchorOffset = 0, focusOffset = 0 } = props;
    this.anchorOffset = anchorOffset;
    this.focusOffset = focusOffset;
  }

  merge(props) {
    return Selection.create({ ...this, ...props });
  }

  get isCollapsed() {
    return this.focusOffset === this.anchorOffset;
  }

  get isBackward() {
    return this.focusOffset < this.anchorOffset;
  }

  get startOffset() {
    return this.isBackward ? this.focusOffset : this.anchorOffset;
  }

  get endOffset() {
    return this.isBackward ? this.anchorOffset : this.focusOffset;
  }

  get offset() {
    return this.startOffset;
  }

  get length() {
    return this.endOffset - this.startOffset;
  }

  setAnchorOffset(anchorOffset = 0) {
    return this.merge({ anchorOffset });
  }

  setFocusOffset(focusOffset = 0) {
    return this.merge({ focusOffset });
  }

  collapse() {
    return this.setFocusOffset(this.anchorOffset);
  }

  insertAt(offset, length) {
    let selection = this;

    if (offset <= selection.anchorOffset) {
      selection = selection.setAnchorOffset(selection.anchorOffset + length);
    }

    if (offset <= selection.focusOffset) {
      selection = selection.setFocusOffset(selection.focusOffset + length);
    }

    return selection;
  }

  deleteAt(offset, length) {
    let selection = this;

    if (offset < selection.anchorOffset) {
      if (offset + length <= selection.anchorOffset) {
        selection = selection.setAnchorOffset(selection.anchorOffset - length);
      } else {
        selection = selection.setAnchorOffset(offset);
      }
    }

    if (offset < selection.focusOffset) {
      if (offset + length <= selection.focusOffset) {
        selection = selection.setFocusOffset(selection.focusOffset - length);
      } else {
        selection = selection.setFocusOffset(offset);
      }
    }

    return selection;
  }

  apply(delta) {
    let offset = 0;

    let selection = this;

    delta.forEach(op => {
      if (typeof op.retain === "number") {
        const { retain: length } = op;

        offset += length;
      } else if (typeof op.insert === "string") {
        const { insert: { length } } = op;

        selection = selection.insertAt(offset, length);

        offset += length;
      } else if (typeof op.insert === "object") {
        const length = 1;

        selection = selection.insertAt(offset, length);

        offset += length;
      } else if (typeof op.delete === "number") {
        const { delete: length } = op;

        selection = selection.deleteAt(offset, length);
      }
    });

    return selection;
  }
}
