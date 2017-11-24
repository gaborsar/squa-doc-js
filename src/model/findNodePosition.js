"use strict";

/**
 * Finds and returns a node relative position.
 *
 * @param {Object[]} nodes
 * @param {number} nodes[].length
 * @param {number} offset
 * @param {boolean} [inclusive]
 * @returns {Object}
 */
export default function findNodePosition(nodes, offset, inclusive = false) {
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
