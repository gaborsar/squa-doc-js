"use strict";

import RangeElement from "./RangeElement";

export default class Range {
  /** @TODO use Iterator */
  static create(nodes, startOffset, endOffset) {
    const elements = [];

    let offset = startOffset;
    let length = endOffset - startOffset;
    let index = 0;

    while (index < nodes.length) {
      const node = nodes[index];
      if (offset < node.length) {
        break;
      }
      offset -= node.length;
      index++;
    }

    while (index < nodes.length) {
      const node = nodes[index];
      const commonLength = Math.min(node.length - offset, length);
      const element = new RangeElement(node, offset, offset + commonLength);
      elements.push(element);
      if (length === commonLength) {
        break;
      }
      offset = 0;
      length -= commonLength;
      index++;
    }

    return new Range(elements);
  }

  constructor(elements) {
    this.elements = elements;
  }
}
