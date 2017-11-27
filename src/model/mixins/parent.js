"use strict";

import Position from "../Position";
import RangeBuilder from "../RangeBuilder";

export default function parentMixin(Node) {
  Node.prototype.createPosition = function(offset, inclusive = false) {
    return Position.create(this.children, offset, inclusive);
  };

  Node.prototype.createRange = function(startOffset, endOffset) {
    return new RangeBuilder(this.children)
      .skip(startOffset)
      .keep(endOffset - startOffset)
      .build();
  };

  Node.prototype.setChildren = function(children) {
    return this.merge({ children });
  };

  Node.prototype.appendChild = function(child) {
    return this.setChildren(this.children.concat(child));
  };

  Node.prototype.insertBefore = function(newChild, referenceChild) {
    const index = this.children.indexOf(referenceChild);

    if (index === -1) {
      return this;
    }

    const children = this.children
      .slice(0, index)
      .concat(newChild)
      .concat(this.children.slice(index));

    return this.setChildren(children);
  };

  Node.prototype.removeChild = function(child) {
    const index = this.children.indexOf(child);

    if (index === -1) {
      return this;
    }

    const children = this.children
      .slice(0, index)
      .concat(this.children.slice(index + 1));

    return this.setChildren(children);
  };

  Node.prototype.replaceChild = function(newChild, referenceChild) {
    const index = this.children.indexOf(referenceChild);

    if (index === -1) {
      return this;
    }

    const children = this.children
      .slice(0, index)
      .concat(newChild)
      .concat(this.children.slice(index + 1));

    return this.setChildren(children);
  };

  Node.prototype.getPreviousSibling = function(child) {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      return this.children[index - 1];
    }

    return null;
  };

  Node.prototype.getNextSibling = function(child) {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      return this.children[index + 1];
    }

    return null;
  };
}
