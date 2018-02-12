import Delta from "quill-delta";
import Style from "./Style";
import Node from "./Node";
import BlockEditor from "./BlockEditor";
import ParentMixin from "./mixins/Parent";
import FormatMixin from "./mixins/Format";
import createKey from "./utils/createKey";
import defaultSchema from "../plugins/schema";

import { EOL } from "../constants";

export default class Block extends FormatMixin(ParentMixin(Node)) {
  static create(props = {}) {
    return new Block(props);
  }

  constructor(props = {}) {
    const {
      schema = defaultSchema,
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

  get isEmbed() {
    return false;
  }

  get isBlock() {
    return true;
  }

  get isInline() {
    return false;
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

  get isEmpty() {
    return this.length === EOL.length;
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
      if (!child.isEmbed && children.length) {
        const prevChild = children[children.length - 1];

        if (!prevChild.isEmbed && prevChild.style === child.style) {
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

  edit() {
    return new BlockEditor(this);
  }

  formatAt(startOffset, endOffset, attributes) {
    return this.edit()
      .retain(startOffset)
      .format(endOffset - startOffset, attributes)
      .build();
  }

  insertAt(offset, value, attributes = {}) {
    return this.edit()
      .retain(offset)
      .insert(value, attributes)
      .build();
  }

  deleteAt(startOffset, endOffset) {
    return this.edit()
      .retain(startOffset)
      .delete(endOffset - startOffset)
      .build();
  }

  apply(delta) {
    return this.edit()
      .apply(delta)
      .build();
  }
}
