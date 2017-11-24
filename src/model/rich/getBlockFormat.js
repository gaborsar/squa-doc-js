"use strict";

import findNodePosition from "../findNodePosition";

/**
 * Returns the format of a block at the given offset.
 *
 * @param {Document} document
 * @param {number} offset
 * @return {Object}
 */
export default function getBlockFormat(document, offset) {
  const { children: blocks } = document;

  if (!blocks.length) {
    return {};
  }

  const pos = findNodePosition(blocks, offset, false);

  if (!pos) {
    return {};
  }

  return blocks[pos.index].style.toObject();
}