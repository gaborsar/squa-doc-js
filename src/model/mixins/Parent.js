"use strict";

import Position from "../Position";
import RangeBuilder from "../RangeBuilder";

const ParentMixin = superclass =>
  class extends superclass {
    createPosition(offset, inclusive = false) {
      return Position.create(this.children, offset, inclusive);
    }

    createRange(startOffset, endOffset) {
      return new RangeBuilder(this.children)
        .skip(startOffset)
        .keep(endOffset - startOffset)
        .build();
    }

    setChildren(children) {
      return this.merge({ children });
    }

    appendChild(child) {
      return this.setChildren(this.children.concat(child));
    }

    insertBefore(newChild, referenceChild) {
      const index = this.children.indexOf(referenceChild);

      if (index === -1) {
        return this;
      }

      const children = this.children
        .slice(0, index)
        .concat(newChild)
        .concat(this.children.slice(index));

      return this.setChildren(children);
    }

    removeChild(child) {
      const index = this.children.indexOf(child);

      if (index === -1) {
        return this;
      }

      const children = this.children
        .slice(0, index)
        .concat(this.children.slice(index + 1));

      return this.setChildren(children);
    }

    replaceChild(newChild, oldChild) {
      const index = this.children.indexOf(oldChild);

      if (index === -1) {
        return this;
      }

      const children = this.children
        .slice(0, index)
        .concat(newChild)
        .concat(this.children.slice(index + 1));

      return this.setChildren(children);
    }

    getPreviousSibling(referenceChild) {
      const index = this.children.indexOf(referenceChild);
      return index !== -1 ? this.children[index - 1] : null;
    }

    getNextSibling(referenceChild) {
      const index = this.children.indexOf(referenceChild);
      return index !== -1 ? this.children[index + 1] : null;
    }
  };

export default ParentMixin;
