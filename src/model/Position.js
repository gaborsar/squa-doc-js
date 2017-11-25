"use strict";

export default class Position {
  static create(nodes, offset, inclusive = false) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];

      if (offset < node.length || (inclusive && offset === node.length)) {
        return new Position(node, i, offset);
      }

      offset -= node.length;
    }

    return new Position(null, nodes.length, 0);
  }

  constructor(node, index, offset) {
    this.node = node;
    this.index = index;
    this.offset = offset;
  }
}
