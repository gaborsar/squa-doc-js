import Delta from "quill-delta";
import Node from "./Node";
import DocumentEditor from "./DocumentEditor";
import ParentMixin from "./mixins/Parent";
import EditMixin from "./mixins/Edit";

export default class Document extends EditMixin(ParentMixin(Node)) {
  static create(props = {}) {
    return new Document(props);
  }

  constructor(props = {}) {
    const { schema, key, children = [] } = props;
    super(schema, key);
    this.children = children;
  }

  merge(props) {
    return Document.create({ ...this, ...props });
  }

  get isEmpty() {
    if (this.children.length !== 1) {
      return false;
    }

    const child = this.children[0];

    return child.isEmpty && child.isPristine;
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
}
