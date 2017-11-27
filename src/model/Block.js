"use strict";

import Schema from "./Schema";
import Style from "./Style";
import Text from "./Text";
import Embed from "./Embed";
import createKey from "./utils/createKey";
import nodeMixin from "./mixins/node";
import parentMixin from "./mixins/parent";
import formatMixin from "./mixins/format";

export const EOL = "\n";

export default class Block {
  static create(props = {}) {
    const {
      schema = new Schema(),
      key = createKey(),
      style = Style.create(),
      children = []
    } = props;
    return new Block(schema, key, style, children);
  }

  constructor(schema, key, style, children) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.children = children;
  }

  merge(props) {
    return Block.create(
      Object.assign(
        {
          schema: this.schema,
          key: this.key,
          style: this.style,
          children: this.children
        },
        props
      )
    );
  }

  get length() {
    return this.children.reduce(
      (length, child) => length + child.length,
      EOL.length
    );
  }

  get text() {
    return this.children.reduce((text, child) => text + child.text, "") + EOL;
  }

  toJSON() {
    return {
      style: this.style.toJSON(),
      children: this.children.map(child => child.toJSON())
    };
  }

  format(attributes) {
    return this.setStyle(
      this.style.update(attributes, type => this.schema.isBlockMark(type))
    );
  }

  formatAt(offset, length, attributes) {
    let node = this;

    if (offset + length === node.length) {
      node = node.format(attributes);
    }

    const range = node.createRange(offset, offset + length);

    range.elements.forEach(el => {
      if (el.isPartial && el.node instanceof Text) {
        if (el.startOffset > 0) {
          node = node.insertBefore(el.node.slice(0, el.startOffset), el.node);
        }

        node = node.insertBefore(
          el.node.slice(el.startOffset, el.endOffset).format(attributes),
          el.node
        );

        if (el.endOffset < el.node.length) {
          node = node.insertBefore(el.node.slice(el.endOffset), el.node);
        }

        node = node.removeChild(el.node);
      } else {
        node = node.replaceChild(el.node.format(attributes), el.node);
      }
    });

    return node;
  }

  insertAt(offset, value, attributes) {
    let node = this;

    let child;

    if (typeof value === "string") {
      child = Text.create({
        schema: node.schema,
        value
      });
    } else if (node.schema.isInlineEmbed(Embed.type(value))) {
      child = Embed.create({
        schema: node.schema,
        value
      });
    }

    if (!child) {
      return node;
    }

    child = child.format(attributes);

    const pos = node.createPosition(offset);

    if (pos) {
      if (pos.offset === 0) {
        node = node.insertBefore(child, pos.node);
      } else if (pos.node instanceof Text) {
        node = node
          .insertBefore(pos.node.slice(0, pos.offset), pos.node)
          .insertBefore(child, pos.node)
          .replaceChild(pos.node.slice(pos.offset), pos.node);
      }
    } else {
      node = node.appendChild(child);
    }

    return node;
  }

  deleteAt(offset, length) {
    let node = this;

    const range = node.createRange(offset, offset + length);

    range.elements.forEach(el => {
      if (el.isPartial && el.node instanceof Text) {
        if (el.startOffset > 0) {
          node = node.insertBefore(el.node.slice(0, el.startOffset), el.node);
        }

        if (el.endOffset < el.node.length) {
          node = node.insertBefore(el.node.slice(el.endOffset), el.node);
        }
      }

      node = node.removeChild(el.node);
    });

    return node;
  }

  normalize() {
    let node = this;

    const children = [];

    node.children.forEach(child => {
      if (child instanceof Text && children.length) {
        const prevChild = children[children.length - 1];

        if (prevChild instanceof Text && prevChild.style === child.style) {
          children[children.length - 1] = prevChild.concat(child);
        } else {
          children.push(child);
        }
      } else {
        children.push(child);
      }
    });

    if (node.children.length !== children.length) {
      node = node.setChildren(children);
    }

    return node;
  }

  slice(startOffset, endOffset) {
    let node = this;

    node = node.regenerateKey();

    if (endOffset < node.length - EOL.length) {
      node = node.deleteAt(endOffset, node.length - EOL.length - endOffset);
    }

    if (startOffset > 0) {
      node = node.deleteAt(0, startOffset);
    }

    return node;
  }

  concat(other) {
    return other.setChildren(this.children.concat(other.children));
  }
}

nodeMixin(Block);
parentMixin(Block);
formatMixin(Block);
