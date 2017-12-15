import Delta from "quill-delta";
import Schema from "./Schema";
import Style from "./Style";
import Node from "./Node";
import Text from "./Text";
import Embed from "./Embed";
import ParentMixin from "./mixins/Parent";
import FormatMixin from "./mixins/Format";
import createKey from "./utils/createKey";

export const EOL = "\n";

export default class Block extends FormatMixin(ParentMixin(Node)) {
  static create(props = {}) {
    return new Block(props);
  }

  constructor(props = {}) {
    const {
      schema = new Schema(),
      key = createKey(),
      style = Style.create(),
      children = []
    } = props;

    super(schema, key);

    this.style = style;
    this.children = children;
  }

  merge(props) {
    return Block.create({ ...this, ...props });
  }

  get kind() {
    return "block";
  }

  get type() {
    return this.getMark("type");
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

  get delta() {
    const delta = new Delta();

    this.children.forEach(child => {
      delta.insert(child.value, child.style.toObject());
    });

    delta.insert(EOL, this.style.toObject());

    return delta;
  }

  format(attributes) {
    const style = this.style.update(attributes, type =>
      this.schema.isBlockMark(type)
    );
    return this.setStyle(style);
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

  formatAt(startOffset, endOffset, attributes) {
    let node = this;

    if (endOffset === node.length) {
      node = node.format(attributes);
    }

    node.createRange(startOffset, endOffset).forEach(el => {
      const { isPartial, node: child } = el;

      if (isPartial) {
        const { startOffset, endOffset } = el;

        if (el.startOffset > 0) {
          node = node.insertBefore(child.slice(0, startOffset), child);
        }

        node = node.insertBefore(
          child.slice(startOffset, endOffset).format(attributes),
          child
        );

        if (endOffset < child.length) {
          node = node.insertBefore(child.slice(endOffset), child);
        }

        node = node.removeChild(child);
      } else {
        node = node.replaceChild(child.format(attributes), child);
      }
    });

    node = node.normalize();

    return node;
  }

  insertInlineAt(offset, child) {
    let node = this;

    const pos = node.createPosition(offset);

    if (pos) {
      const { node: referenceChild, offset: childOffset } = pos;

      if (childOffset === 0) {
        node = node.insertBefore(child, referenceChild);
      } else {
        node = node
          .insertBefore(referenceChild.slice(0, childOffset), referenceChild)
          .insertBefore(child, referenceChild)
          .replaceChild(referenceChild.slice(childOffset), referenceChild);
      }
    } else {
      node = node.appendChild(child);
    }

    node = node.normalize();

    return node;
  }

  insertTextAt(offset, value, attributes = {}) {
    let node = this;

    const { schema } = node;

    const child = Text.create({ schema, value }).format(attributes);

    node = node.insertInlineAt(offset, child);

    return node;
  }

  insertInlineEmbed(offset, value, attributes = {}) {
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

  insertAt(offset, value, attributes = {}) {
    if (typeof value === "string") {
      return this.insertTextAt(offset, value, attributes);
    }

    if (typeof value === "object") {
      return this.insertInlineEmbed(offset, value, attributes);
    }

    throw new Error(`Invalid value: ${value}`);
  }

  deleteAt(startOffset, endOffset) {
    let node = this;

    node.createRange(startOffset, endOffset).forEach(el => {
      const { isPartial, node: child } = el;

      if (isPartial) {
        const { startOffset, endOffset } = el;

        if (startOffset > 0) {
          node = node.insertBefore(child.slice(0, startOffset), child);
        }

        if (endOffset < child.length) {
          node = node.insertBefore(child.slice(endOffset), child);
        }
      }

      node = node.removeChild(child);
    });

    node = node.normalize();

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

  slice(startOffset = 0, endOffset = Infinity) {
    let node = this;

    const children = node
      .createRange(startOffset, endOffset)
      .map(
        el =>
          el.isPartial ? el.node.slice(el.startOffset, el.endOffset) : el.node
      );

    node = node.setChildren(children);

    if (endOffset < node.length) {
      node = node.regenerateKey();
    }

    return node;
  }

  concat(other) {
    return other.setChildren(this.children.concat(other.children)).normalize();
  }
}
