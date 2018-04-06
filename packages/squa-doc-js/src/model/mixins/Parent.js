import findPosition from "../findPosition";
import RangeBuilder from "../RangeBuilder";

const ParentMixin = superclass =>
  class extends superclass {
    findPosition(offset, inclusive = false) {
      return findPosition(this.children, offset, inclusive);
    }

    createRange(startOffset, endOffset) {
      return new RangeBuilder(this.children)
        .skip(startOffset)
        .keep(endOffset - startOffset)
        .build();
    }

    setChildren(children = []) {
      return this.merge({ children });
    }

    empty() {
      return this.setChildren();
    }

    prependChild(child) {
      return this.setChildren([child].concat(this.children));
    }

    prependChildren(children) {
      return this.setChildren(children.concat(this.children));
    }

    appendChild(child) {
      return this.setChildren(this.children.concat(child));
    }

    appendChildren(children) {
      return this.setChildren(this.children.concat(children));
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

      if (index !== -1) {
        return this.children[index - 1];
      }
    }

    getNextSibling(referenceChild) {
      const index = this.children.indexOf(referenceChild);

      if (index !== -1) {
        return this.children[index + 1];
      }
    }

    getChildByKey(key) {
      return this.children.find(child => child.key === key);
    }
  };

export default ParentMixin;
