"use strict";

import findNodeAt from "../findNodeAt";

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

  const pos = findNodeAt(blocks, offset, false);

  if (pos) {
    attributes = blocks[pos.index].style.toObject();
  }

  return attributes;
}