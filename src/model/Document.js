import Delta from "quill-delta";
import Schema from "./Schema";
import Text from "./Text";
import Embed from "./Embed";
import Node from "./Node";
import Block from "./Block";
import ParentMixin from "./mixins/Parent";
import createKey from "./utils/createKey";

import { EOL } from "../constants";

export default class Document extends ParentMixin(Node) {
  static create(props = {}) {
    return new Document(props);
  }

  constructor(props = {}) {
    const {
      schema = new Schema(),
      key = createKey(),
      children = [Block.create()]
    } = props;

    super(schema, key);

    this.children = children;
  }

  merge(props) {
    return Document.create({ ...this, ...props });
  }

  get kind() {
    return "document";
  }

  get length() {
    return this.children.reduce((length, child) => length + child.length, 0);
  }

  get text() {
    return this.children.reduce((text, child) => text + child.text, "");
  }

  get delta() {
    let delta = new Delta();

    this.children.forEach(child => {
      delta = delta.concat(child.delta);
    });

    return delta;
  }

  formatAt(startOffset, endOffset, attributes) {
    let node = this;

    node.createRange(startOffset, endOffset).forEach(el => {
      const { node: child, startOffset, endOffset } = el;

      node = node.replaceChild(
        child.formatAt(startOffset, endOffset, attributes),
        child
      );
    });

    return node;
  }

  insertInlineAt(offset, child) {
    let node = this;

    const pos = node.createPosition(offset);

    if (!pos) {
      throw new Error(`Invalid offset: ${offset}`);
    }

    const { node: referenceChild, offset: childOffset } = pos;

    node = node.replaceChild(
      referenceChild.insertInlineAt(childOffset, child),
      referenceChild
    );

    return node;
  }

  insertTextAt(offset, value, attributes = {}) {
    let node = this;

    const { schema } = node;

    const child = Text.create({ schema, value }).format(attributes);

    node = node.insertInlineAt(offset, child);

    return node;
  }

  insertInlineEmbedAt(offset, value, attributes = {}) {
    let node = this;

    const { schema } = node;

    const type = Embed.type(value);

    if (!schema.isInlineEmbed(type)) {
      throw new Error(`Invalid inline embed type: ${type}`);
    }

    const child = Embed.create({ schema, value }).format(attributes);

    node = node.insertInlineAt(offset, child);

    return node;
  }

  splitBlockAt(offset, attributes = {}) {
    let node = this;

    const pos = node.createPosition(offset);

    if (!pos) {
      throw new Error(`Invalid offset: ${offset}`);
    }

    const { node: child, offset: childOffset } = pos;

    if (child.kind === "embed") {
      throw new Error(`Invalid offset: ${offset}`);
    }

    node = node
      .insertBefore(
        child
          .slice(0, childOffset)
          .clearStyle()
          .format(attributes),
        child
      )
      .replaceChild(child.slice(childOffset), child);

    return node;
  }

  insertBlockAt(offset, child) {
    let node = this;

    const pos = node.createPosition(offset);

    if (!pos) {
      throw new Error(`Invalid offset: ${offset}`);
    }

    const { node: referenceChild, offset: childOffset } = pos;

    if (childOffset !== 0) {
      throw new Error(`Invalid offset: ${offset}`);
    }

    node = node.insertBefore(child, referenceChild);

    return node;
  }

  insertBlockEmbedAt(offset, value, attributes = {}) {
    let node = this;

    const { schema } = node;

    const type = Embed.type(value);

    if (!schema.isBlockEmbed(type)) {
      throw new Error(`Invalid block embed type: ${type}`);
    }

    const child = Embed.create({ schema, value }).format(attributes);

    node = node.insertBlockAt(offset, child);

    return node;
  }

  insertAt(offset, value, attributes = {}) {
    let node = this;

    if (typeof value === "string") {
      const lines = value.split(EOL);

      let line = lines.pop();

      if (line.length) {
        node = node.insertTextAt(offset, line, attributes);
      }

      while (lines.length) {
        node = node.splitBlockAt(offset, attributes);

        line = lines.pop();

        if (line.length) {
          node = node.insertTextAt(offset, line, attributes);
        }
      }

      return node;
    }

    if (typeof value === "object") {
      const { schema } = node;

      const type = Embed.type(value);

      if (schema.isInlineEmbed(type)) {
        return node.insertInlineEmbedAt(offset, value, attributes);
      }

      if (schema.isBlockEmbed(type)) {
        return node.insertBlockEmbedAt(offset, value, attributes);
      }

      throw new Error(`Invalid embed type: ${type}`);
    }

    throw new Error(`Invalid value: ${value}`);
  }

  deleteAt(startOffset, endOffset) {
    let node = this;

    const startPos = node.createPosition(startOffset);

    if (!startPos) {
      throw new Error(`Invalid offset: ${startOffset}`);
    }

    const endPos = node.createPosition(endOffset);

    if (!endPos) {
      throw new Error(`Invald offset: ${endOffset}`);
    }

    const { node: startChild, offset: startChildOffset } = startPos;
    const { node: endChild, offset: endChildOffset } = endPos;

    if (startChildOffset === 0 && endChildOffset === 0) {
      let currentChild = startChild;

      while (currentChild !== endChild) {
        const nextChild = node.getNextSibling(currentChild);

        node = node.removeChild(currentChild);

        currentChild = nextChild;
      }
    } else if (startChildOffset === 0) {
      let currentChild = startChild;

      while (currentChild !== endChild) {
        const nextChild = node.getNextSibling(currentChild);

        node = node.removeChild(currentChild);

        currentChild = nextChild;
      }

      const newEndChild = endChild.slice(endChildOffset);

      node = node.replaceChild(newEndChild, endChild);
    } else if (endChildOffset === 0) {
      let currentChild = startChild;

      while (currentChild !== endChild) {
        const nextChild = node.getNextSibling(currentChild);

        node = node.removeChild(currentChild);

        currentChild = nextChild;
      }

      const newStartChild = startChild.slice(0, startChildOffset);

      if (endChild.kind === "block") {
        node = node.removeChild(startChild);

        const newEndChild = newStartChild.concat(endChild);

        node = node.replaceChild(newEndChild, endChild);
      } else {
        node = node.insertBefore(newStartChild, endChild);
      }
    } else {
      let currentChild = startChild;

      while (currentChild !== endChild) {
        const nextChild = node.getNextSibling(currentChild);

        node = node.removeChild(currentChild);

        currentChild = nextChild;
      }

      const newStartChild = startChild.slice(0, startChildOffset);

      let newEndChild = endChild.slice(endChildOffset);

      newEndChild = newStartChild.concat(newEndChild);

      node = node.replaceChild(newEndChild, endChild);
    }

    return node;
  }

  apply(delta) {
    let offset = 0;

    let node = this;

    delta.forEach(op => {
      if (typeof op.retain === "number") {
        const { retain: length, attributes } = op;

        if (attributes) {
          node = node.formatAt(offset, offset + length, attributes);
        }

        offset += length;
      } else if (typeof op.insert === "string") {
        const { insert: value, attributes = {} } = op;

        node = node.insertAt(offset, value, attributes);

        offset += value.length;
      } else if (typeof op.insert === "object") {
        const { insert: value, attributes = {} } = op;

        node = node.insertAt(offset, value, attributes);

        offset += 1;
      } else if (typeof op.delete === "number") {
        const { delete: length } = op;

        node = node.deleteAt(offset, offset + length);
      }
    });

    return node;
  }
}
