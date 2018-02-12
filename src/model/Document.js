import Delta from "quill-delta";
import Node from "./Node";
import Block from "./Block";
import DocumentEditor from "./DocumentEditor";
import ParentMixin from "./mixins/Parent";
import createKey from "./utils/createKey";
import defaultSchema from "../plugins/schema";

export default class Document extends ParentMixin(Node) {
  static create(props = {}) {
    return new Document(props);
  }

  constructor(props = {}) {
    const {
      schema = defaultSchema,
      key = createKey(),
      children = [Block.create()]
    } = props;

    super(schema, key);

    this.children = children;
  }

  merge(props) {
    return Document.create({ ...this, ...props });
  }

  get length() {
    return this.children.reduce((length, child) => length + child.length, 0);
  }

  get delta() {
    let delta = new Delta();

    this.children.forEach(child => {
      delta = delta.concat(child.delta);
    });

    return delta;
  }

  edit() {
    return new DocumentEditor(this);
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
