import Delta from "quill-delta";
import Style from "./Style";
import Node from "./Node";
import BlockEditor from "./BlockEditor";
import ParentMixin from "./mixins/Parent";
import FormatMixin from "./mixins/Format";
import EditMixin from "./mixins/Edit";
import { EOL } from "../constants";

export default class Block extends EditMixin(FormatMixin(ParentMixin(Node))) {
  static create(props = {}) {
    return new Block(props);
  }

  constructor(props = {}) {
    const { schema, key, style = Style.create(), children = [] } = props;
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

  get isEmpty() {
    return this.children.length === 0;
  }

  get isPristine() {
    return this.style.marks.length === 0;
  }

  get type() {
    return this.getMark("type");
  }

  get length() {
    return this.children.reduce((length, child) => length + child.length, EOL.length);
  }

  get text() {
    return this.children.reduce((text, child) => text + child.text, "") + EOL;
  }

  get delta() {
    const delta = new Delta();

    this.children.forEach(child => {
      delta.insert(child.value, child.getFormat());
    });

    delta.insert(EOL, this.getFormat());

    return delta;
  }

  format(attributes) {
    return this.setStyle(
      this.style.update(attributes, type => this.schema.isBlockMark(type))
    );
  }

  normalize() {
    let node = this;

    if (node.children.length !== 0) {
      const children = [];
      let prevChild = node.children[0];

      for (let i = 1; i < node.children.length; i++) {
        const child = node.children[i];
        if (
          prevChild.isEmbed ||
          child.isEmbed ||
          prevChild.style !== child.style
        ) {
          children.push(prevChild);
          prevChild = child;
        } else {
          prevChild = prevChild.concat(child);
        }
      }

      children.push(prevChild);

      if (node.children.length !== children.length) {
        node = node.setChildren(children);
      }
    }

    return node;
  }

  edit() {
    return new BlockEditor(this);
  }
}
