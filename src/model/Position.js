"use strict";

export default class Position {
  static create(nodes, offset, inclusive = false) {
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      if (offset < node.length || (inclusive && offset === node.length)) {
        return new Position(node, index, offset);
      }
      offset -= node.length;
    }
    return null;
  }

  constructor(node, index, offset) {
    this.node = node;
    this.index = index;
    this.offset = offset;
  }
}
