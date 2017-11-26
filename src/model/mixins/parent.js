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
    let node = this;

    const index = node.children.indexOf(referenceChild);

    if (index !== -1) {
      const children = node.children
        .slice(0, index)
        .concat(newChild)
        .concat(node.children.slice(index));

      node = node.setChildren(children);
    } else {
      node = node.appendChild(newChild);
    }

    return node;
  };

  Node.prototype.removeChild = function(child) {
    let node = this;

    const index = node.children.indexOf(child);

    if (index !== -1) {
      const children = node.children
        .slice(0, index)
        .concat(node.children.slice(index + 1));

      node = node.setChildren(children);
    }

    return node;
  };

  Node.prototype.replaceChild = function(newChild, referenceChild) {
    let node = this;

    const index = node.children.indexOf(referenceChild);

    if (index !== -1) {
      const children = node.children
        .slice(0, index)
        .concat(newChild)
        .concat(node.children.slice(index + 1));

      node = node.setChildren(children);
    }

    return node;
  };

  Node.prototype.getPreviousSibling = function(child) {
    const index = this.children.indexOf(child);

    if (index !== -1 && index > 0) {
      return this.children[index - 1];
    }

    return null;
  };

  Node.prototype.getNextSibling = function(child) {
    const index = this.children.indexOf(child);

    if (index !== -1 && index < this.children.length - 1) {
      return this.children[index + 1];
    }

    return null;
  };
}
