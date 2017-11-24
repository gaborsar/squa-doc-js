"use strict";

export default function findNodeAt(nodes, offset, inclusive = false) {
  let index = 0;

  while (index < nodes.length) {
    const node = nodes[index];

    if (offset < node.length || (inclusive && offset === node.length)) {
      return { index, offset };
    }

    index += 1;
    offset -= node.length;
  }

  return null;
}
