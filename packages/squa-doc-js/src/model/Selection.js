export default class Selection {
    constructor({ anchorOffset = 0, focusOffset = 0 } = {}) {
        this.anchorOffset = anchorOffset;
        this.focusOffset = focusOffset;
    }

    merge(props) {
        return new Selection({ ...this, ...props });
    }

    get offset() {
        return Math.min(this.anchorOffset, this.focusOffset);
    }

    get length() {
        return Math.abs(this.focusOffset - this.anchorOffset);
    }

    getAnchorOffset() {
        return this.anchorOffset;
    }

    getFocusOffset() {
        return this.focusOffset;
    }

    getOffset() {
        return this.offset;
    }

    getLength() {
        return this.length;
    }

    isCollapsed() {
        return this.anchorOffset === this.focusOffset;
    }

    isExpanded() {
        return this.anchorOffset !== this.focusOffset;
    }

    isBackward() {
        return this.anchorOffset > this.focusOffset;
    }

    setAnchorOffset(anchorOffset) {
        return this.merge({ anchorOffset });
    }

    setFocusOffset(focusOffset) {
        return this.merge({ focusOffset });
    }

    collapse() {
        return this.setFocusOffset(this.anchorOffset);
    }

    collapseToLeft() {
        return this.isBackward()
            ? this.setAnchorOffset(this.focusOffset)
            : this.setFocusOffset(this.anchorOffset);
    }

    collapseToRight() {
        return this.isBackward()
            ? this.setFocusOffset(this.anchorOffset)
            : this.setAnchorOffset(this.focusOffset);
    }

    apply(delta) {
        return this.merge({
            anchorOffset: delta.transformPosition(this.anchorOffset),
            focusOffset: delta.transformPosition(this.focusOffset)
        });
    }
}
