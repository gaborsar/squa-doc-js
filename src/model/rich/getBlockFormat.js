"use strict";

import findNodePosition from "../findNodePosition";

/**
 * Returns the format of the given range.
 *
 * @param {Document} document
 * @param {number} offset
 * @return {Object}
 */
export default function getBlockFormat(document, offset) {
  const { children: blocks } = document;

  let attributes = {};

  const pos = findNodePosition(blocks, offset, false);

  if (pos) {
    attributes = blocks[pos.index].style.toObject();
  }

  return attributes;
}
